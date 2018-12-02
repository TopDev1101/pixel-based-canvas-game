/**
 * Daniel Tran copyright 2018
 * 
 * Expending to n-dimensions
 *      Simply adjust a few parameters
 * 
 * Expanding for all sorts of different map formats
 *      Simply create an interface and modify this code to work with the interface
 */

/*

interfsce World{
    boolean isObstacleAt( int x, int y );
}

*/

class PathfindingMapNode{
    /**
     * 
     * @param {Any} object Object at the node's location
     * @param {CoordinateVector} position Position of the node within the map
     * @param {PathfindingMapNode} parentNode Parent node, or null if is base node
     */
    constructor( object, position, parentNode = null, cost = 0, destination ){
        this.object = object;
        this.parentNode = parentNode;
        this.isBase = !!!parentNode;
        this.position = position;
        this.open = true;
        this.cost = cost;
        this.headNode = null;
        if(!this.isBase){
            this.headNode = parentNode.headNode;
            this.destination = parentNode.destination;
            parentNode.open = false;
            this.depth = parentNode.depth+1;
        }else{
            this.headNode = this;
            this.destination = destination;
            this.depth = 0;
        }

        // Cost to get to destination
        this.goalCost = Math.distance( this.position.x, this.position.y, this.destination.x, this.destination.y );

        // Cost to reach this node from the head (beginning node);
        this.reachCost = Math.distance( this.position.x, this.position.y, this.headNode.position.x, this.headNode.position.y );

        this.totalCost = this.reachCost + this.goalCost;
    }
}

class PathfindingPathCache{
    /**
     * Pathfinding algorithm is quite expensive.
     * Chances are that an entity might want to go to the same place more than once
     * So we cache paths, keep the frequently used ones and ditch the least used ones
     * @param {CoordinateVector} startingPosition Starting position of this path
     * @param {CoordinateVector} destination Destination of this path
     * @param {CoordinateVector[]} path Full path
     */
    constructor( startingPosition, destination, path ){

    }
}

class PathfindingErrorHandler{
    constructor(){

    }

    handle( errorId, desc, data ){
        if( this[`on_${errorId}`] ){
            return this[`on_${errorId}`]( desc, data );
        }
    }

    on_iterationMaxExceeded( ...params ){
        return params;
    }

    on_canceled( ...params ){
        return params;
    }

    on_closedArea( ...params ){
        return params;
    }
}

/**
 * A new pathfinding runtime is created every time a new path is requested to be calculated
 */
class PathfindingRuntime{
    constructor(){

    }
}

class PathfindingAI{
    /**
     * 
     * @param {Function} nodeAcceptCondition callback( object ) -> Boolean;
     * @param {PathfindingErrorHandler} error
     */
    constructor( nodeAcceptCondition, error ){
        // Constants
        this.neighbours = TSINTERFACE.neighbourOffsetVectorList; // cfg.pathfinding_cost_vh
        this.neighboursDiagonal = TSINTERFACE.neighbourDiagonalOffsetVectorList; // cfg.pathfinding_cost_diagonal
        this.nodeAcceptCondition = nodeAcceptCondition;
        this.cache = [];
        this.error = error ? error : new PathfindingErrorHandler();

        // Working memory
        this.path = [];
        this.nodes = [];
        this.nodesMapped = {};
        this.iterations = 0;
        this.cancel = false;
        this.done = false;
        this.promise = null;
        this.resolve = null;
        this.reject = null;
        this.time = {start: new Date().getTime()};
        this.destination = null;

        // Analytics
        this.analytics = {
            loops:{
                nextIteration_calls: 0,
                nextIteration_nodeSearches: 0,
                nextIteration_neighbourMaps: 0
            },
            times:[],
            // in intervals of n tiles
            distanceCost:{

            }
        };
    }

    /**
     * 
     * @param {CoordinateVector} startingPosition 
     * @param {CoordinateVector} destination 
     * @returns Promise
     */
    startPathfinding( startingPosition, destination ){
        this.clearWorkingData();
        var self = this;
        this.destination = destination;
        var object = TSINTERFACE.World.getTile( ...startingPosition.values );
        var parentNode = this.createNode( object, startingPosition, null, null, destination );
        this.promise = new Promise( ( resolve, reject )=>{ self.pathfindingPromiseHandler( self, resolve, reject ); } );
        this.time = {start: new Date().getTime()};
        return this.promise;
        /*
            startPathFinding( [...] ).then( success( destinationNode ), faul( errorMessage ) );
         */
    }

    /**
     * Expand a node into a full path
     * use path.pop() to get the next location
     * @param {PathfindingMapNode} node 
     */
    expandPath( node ){
        var workingNode = node;
        while( !workingNode.isBase ){
            this.path.push( workingNode.position );
            workingNode = workingNode.parentNode;
        }
        this.path.push( workingNode.position );
        return this.path;
    }

    pathfindingPromiseHandler( self, resolve, reject ){
        self.resolve = resolve;
        self.reject = reject;
        this.nextIteration( self );
    }

    /**
     * Clears all working data for next pathfinding procedure
     */
    clearWorkingData(){
        this.path = [];
        this.nodes = [];
        this.nodesMapped = {}; // Hash the coordinates of the node :^)
        this.iterations = 0;
        this.cancel = false;
        this.done = false;
        this.promise = null;
        this.resolve = null;
        this.reject = null;
        this.time = null;
        this.terminate = false;
        this.destination = null;
    }

    /**
     * 
     * @param {Any} object Object at that map
     * @param {CoordinateVector} position Position on the map of that node
     * @param {PathfindingMapNode} parentNode Parent node that called to create a new node, null if is base node
     */
    createNode( object, position, parentNode = null, cost, destination ){
        var node = new PathfindingMapNode( object, position, parentNode, cost, destination );
        this.nodes.push( node );
        this.markNodeSearched( position );
        return node;
    }

    /**
     * Marks a node as searched so the algorithm doesn't search it again.
     * @param {CoordinateVector} coordVect 
     */
    markNodeSearched( coordVect ){
        this.nodesMapped[ coordVect.values.join("_") ] = true;
    }

    /**
     * Finds the next open, available node to extend
     */
    findNextAvailableNode(){
        var workingNode = null;
        var closedNodes = 0;
        this.nodes.map( ( node, i, arr )=>{
            if(this.cancel){return;} // For safety
            if(!node.open){
                closedNodes++;
                if(arr.length-1 == closedNodes){ this.reject(this.error.handle( "closedArea", "Could not find path: Closed area.", this )); this.cancel = true;}
                return;
            }
            if(!workingNode){
                workingNode = node;
                return;
            }
            if( node.totalCost < workingNode.totalCost ){
                workingNode = node;
            }
            this.analytics.nextIteration_nodeSearches++;
        });
        return workingNode;
    }

    /**
     * A checkpoint to make sure the iteration can continue;
     * @param {this} self 
     * @param {Number} batchIteration 
     */
    iterationCanContinue( self, batchIteration ){
        if(self.terminate){return;}
            // Checks to make sure the path finding operation can succeed
        if( self.iterations == cfg.pathfinding_iteration_max ){
            self.reject( self.error.handle( "iterationMaxExceeded", "Could not find path: too many iterations", self ) );
            self.terminate = true;
            return;
        }
        if(self.cancel){
            self.reject( self.error.handle( "canceled", "Could not find path: canceled.", self ) );
            self.terminate = true;
            return;
        }
        if(self.done){
            self.terminate = true;
            return;
        }
        return true;
    }
    
    /**
     * Runs within a promise
     * @param {this} self 
     */
    nextIteration( self ){
        for( var batchIteration = 0; batchIteration < cfg.pathfinding_batch_size; batchIteration++ ){
            if ( !self.iterationCanContinue(self, batchIteration)  ) return;
            // find closest node to the destination
            var workingNode = self.findNextAvailableNode();
            
            

            // get neighbours of that node, make sure the neighbour isn't already a part of the list
            var neighbourCounter = 0;    
            self.neighbours.map( ( offsetVector, i, arr )=>{
                if(self.cancel){self.terminate = true; return;} // For safety
                var nextNodePosition = workingNode.position.add( offsetVector );

                // Make sure the node hasn't already been checked
                if( !self.nodesMapped[ nextNodePosition.values.join("_") ] ){
                    // Check if object is valid
                    var object = TSINTERFACE.World.getTile( ...nextNodePosition.values );

                    // Create new node if object is valid
                    if( self.nodeAcceptCondition( object ) ){
                        var node = self.createNode( object, nextNodePosition, workingNode, cfg.pathfinding_cost_vh );
                        // Denugging
                        
                        if( node.position.equals(node.destination) ){
                            self.done = true;
                            self.time = {};
                            self.time.done = new Date().getTime();
                            self.time.taken = self.time.done - self.time.start;
                            self.time.depth = node.depth;
                            self.time.msPerNode = self.time.taken / self.time.depth;
                            self.analytics.times.push( self.time );
                            self.resolve( node );
                        }
                    }else{
                        self.markNodeSearched( nextNodePosition );
                    }
                }else{
                    // if the node is surrounded (by obstacle or other nodes), close it off
                    neighbourCounter++;
                    if( neighbourCounter == arr.length-1){
                        workingNode.open = false;
                    }
                }
                
                self.analytics.nextIteration_neighbourMaps++;
            });

            self.iterations++;
            self.analytics.nextIteration_calls++;

        }

        if(self.terminate){return;}
        
        if(!self.cancel){
            setTimeout( ()=>{
                self.nextIteration( self );
            });
        }
        
    }
}