/* File source: ../src/Ambitious_Dwarf///src/game/map/tilemap.js */
// Saves memory by storing redundant data in the same index
class TileMap extends BoPlane{
	constructor( rows, cols, defaultTile ){
		super( rows, cols, "payload" );
		
		this.forterator.default = this.createNode( 0, 0, defaultTile );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/worldgen.js */
const SIMPLEX_NOISE = require("simplex-noise");
class WorldGen{
    constructor( seed = "" ){
        this.seed = seed;
        this.elevationNoise = new SIMPLEX_NOISE( this.seed+"stone" );
    }

    /**
     * Gets the tile elevation at (x,y)
     * @param {Number} x Global tile coordinates
     * @param {Number} y Global tile coordinates
     */
    getElevationAt( x, y ){
        return this.elevationNoise.noise2D( x * cfg.generation_elevationCoefficient_x, y * cfg.generation_elevationCoefficient_y );
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/world.js */


class SpecialTilePayload{
	constructor( tile, position ){
		this.tile = tile;
		this.position = position;
	}
}

class World{
    constructor( saveData ){
		this.entities = [];
		this.chunkSize = cfg.world_chunkSize;
		this.defaultTile = Townsend.tiles.default;
		this.map = new UboPlane( {} ); // UboPlane<TileMap>
		this.chunks = [];
		this.chunkNeedsPrerender = [];

		this.seed = cfg.debug_seed_default;
		this.generation = new WorldGen( this.seed );
		this.noise = {
			elevation: new SIMPLEX_NOISE( this.seed+"stone" )
		};

		this.jobs = [];

		this.mapLength = cfg.world_map_size_debug; // A side length of the map in chunks, must be even
		this.totalChunks = 0;
		this.renderedChunks = 0;

		this.lastTopLeftBound = new Vector(0,0);
		this.lastBottomRightBound = new Vector(0,0);
		this.topLeftBoundResizeDiff = new Vector(0,0);
		this.topLeftBound = new Vector(0,0);
		this.bottomRightBound = new Vector(0,0);
		this.origin = new Vector(0,0);
		this.height = 32;
		this.width = 32;
		this.boundsChanged = false;
		this.paused = false;
		this.updateInterval = cfg.update_interval_normal;

		this.lastUpdateTime = new Date().getTime();

		this.udps = 0;
		this.udc = 0;
		this.udl = new Date().getTime();
		this.udlt = new Date().getTime();
		this.udps = 0;

		this.updateStart = new Date().getTime();

		this.time = 10;
		this.ticks = 0;

		this.run = true;

		this.specialTiles = {};
		this.specialTileLocations = {};

		// No world states go after this
		this.createNewMap();

		this.timeInterval = this.startTimeInterval();
	}

	updateUDS(){
		var udtn = new Date().getTime();
		
		if( udtn - this.udlt >=1000 ){
			this.udps = this.udc;
			this.udc = 0;
			this.udlt = udtn;
		}else{
			this.udc++;
		}
	}

	/**
	 * searches for a tile that has 
	 * @param {*} tileIdentifier Actor.identityString
	 * @param {*} queryFunction callback( specialTilePayload );
	 */
	querySpecialTiles( tileIdentifier, queryFunction ){
		var out = null, tileGroup = this.specialTiles[tileIdentifier];
		if(tileGroup){
			var tileUUIDs = Object.keys(tileGroup);
			for( var tileUUIDIndex = 0; tileUUIDIndex < tileUUIDs.length; tileUUIDIndex++){
				var payload = tileGroup[ tileUUIDs[ tileUUIDIndex ] ];
				if( queryFunction( payload ) ){
					out = payload;
					break;
				}
			}
		}
		return out;
	}

	confirmSpecialTileGroupExists( tile ){
		if(!this.specialTiles[ tile.identityString ] ){
			this.specialTiles[ tile.identityString ] = {};
		}
	}

	/**
	 * Adds a special tile, used for lookup and indexing
	 * @param {Tile} tile 
	 * @param {CoordinateVector} position globalTilePosition
	 */
	addSpecialTile( tile, position ){
		this.confirmSpecialTileGroupExists( tile );
		var payload = new SpecialTilePayload( tile, position );
		this.specialTiles[ tile.identityString ][ tile.uuid ] = payload;
		this.specialTileLocations[ position.string ] = tile;
	}

	/**
	 * 
	 * @param {CoordinateVector} position globalTilePosition
	 */
	removeSpecialTile( position ){
		var tile = this.specialTileLocations[ position.string ];
		this.confirmSpecialTileGroupExists( tile );
		delete this.specialTiles[ tile.identityString ][ tile.uuid ];
		delete this.specialTileLocations[ position.string ];
	}

	placeTile( tile, x, y ){
		if( this.specialTileLocations[ `${x}_${y}` ] ){
			this.removeSpecialTile( new Vector(x,y) );
		}
		if(tile.isSpecial){
			this.addSpecialTile( tile, new Vector(x,y) );
		}
		this.placeObject( tile, x, y );
	}

	removeTile( x, y ){
		this.placeTile( Townsend.tiles.default, x, y );
	}

	updateloop(){
		var self = this;
		if( new Date().getTime() - this.lastUpdateTime >= this.updateInterval ){
			this.lastUpdateTime = new Date().getTime();
			this.update();
		}
		setTimeout( ()=>{ self.updateloop.apply(self); }, 0 );
	}

	update(){
		this.updateCost = new Date().getTime() - this.updateStart;
		this.updateStart = new Date().getTime();
		var self = this;
		if(self.paused){
			return;
		}
		self.ticks++;
		this.updateUDS();
		self.entities.map( (entity)=>{
			entity.update(self.ticks);
		});
		Townsend.analytics.udps = this.udps;
		/*
		setTimeout( ()=>{
			self.chunks.map( (chunk)=>{
				chunk.update(self.ticks);
			});
		});*/
	}

	increaseRenderedChunks(){
		this.renderedChunks++;
		Townsend.analytics.chunksLoaded = this.renderedChunks+"/"+this.totalChunks;
	}
	
	startTimeInterval(){
		var self = this;
		setInterval( ()=>{ self.changeTime(); }, 10000);
	}

	changeTime(){
		this.time++;
		Townsend.analytics.time = this.time;
		if(!cfg.world_time_draw_enable){return;}
		var ctx = Townsend.CVSCTX.lightsOverflow;
		ctx.fillStyle = new Color( 10, 5, 20 ).rgbString;
		ctx.globalAlpha = ( Math.abs( (this.time % 20) - 10 ) / 10 ) / 1.15;
		ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
		ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	}

	/**
	 * Checks if tile at (globalX, globalY, [globalZ]) is an obstacle
	 * @param {*} globalX 
	 * @param {*} globalY 
	 * @param {*} globalZ 
	 */
	isObstacle( globalX, globalY, globalZ ){

	}

	/**
	 * Gets the full map node payload at (globalX, globalY)
	 * ! Includes tile metadata
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	getPayloadNode( globalX, globalY ){
		// Find out which chunk
		var chunk = this.getChunkFromTile( globalX, globalY );
		if( chunk ){
			return chunk.getObject(
				Math.mod( globalX, this.chunkSize ),
				Math.mod( globalY, this.chunkSize )).payload.tile;
		}
		return null;
	}

	/**
	 * Get the tile at (globalX, globalY)
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	getTile( globalX, globalY ){
		// Find out which chunk
		var chunk = this.getChunkFromTile( globalX, globalY );
		if( chunk ){
			return chunk.getObject(
				Math.mod( globalX, this.chunkSize ),
				Math.mod( globalY, this.chunkSize )).payload.tile;
		}else if(this.tileExists( globalX, globalY )){
			return Townsend.tiles.default;
		}
		return null;
	}

	/**
	 * Checks if a tile exists at (globalX, globalY)
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	tileExists( globalX, globalY ){
		return !!this.getPayloadNode(globalX, globalY);
	}

	/**
	 * Get a tile along with more information relating to the tile
	 * @param {Number} globalX 
	 * @param {Number} globalY 
	 */
	getTilePlus( globalX, globalY ){
		var self = this;
		return {
			tile:this.getTile(globalX, globalY),
			chunk:this.getChunkFromTile( globalX, globalY ),
			position: new Vector( globalX, globalY ),
			chunkRelPosition: new Vector(globalX, globalY).forEach( (n)=>{ return Math.mod( n, self.chunkSize );} )
		};
	}

	/**
	 * Places down an object into the uboplane
	 * ! Does not manipulate the map state to recognize that the object is a tile
	 * @param {*} object 
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	placeObject( object, globalX, globalY ){
		var chunk = this.getChunkFromTile( globalX, globalY );
		if( chunk ){
			return chunk.t3_placeTile(object,
				Math.mod( globalX, this.chunkSize ),
				Math.mod( globalY, this.chunkSize ));
		}
	}
	
	/**
	 * Gets a chunk at ( chunkX, chunkY )
	 * @param {*} chunkX 
	 * @param {*} chunkY 
	 */
	getChunk(chunkX, chunkY){
		var chunkNode = this.map.getObject( chunkX,chunkY );
		if( chunkNode ){
			return chunkNode.object;
		}
		return null;
	}

	/**
	 * Gets the chunk at tile location ( globalX, globalY )
	 * @param {Number} globalX Global X
	 * @param {Number} globalY Global Y
	 */
	getChunkFromTile( globalX, globalY ){
		var chunkX = ( globalX - Math.mod(globalX, this.chunkSize) ) / this.chunkSize,
			chunky = ( globalY - Math.mod(globalY, this.chunkSize) ) / this.chunkSize,
			chunkNode = this.map.getObject( chunkX,chunky );
		if( chunkNode ){
			return chunkNode.object;
		}
		return null;
	}

	getObjectsAt( globalX, globalY ){
		var gtCoordVect = new Vector( globalX, globalY );
		return {
			entities: this.entities.filter( ( entity )=>{ return entity.globalTilePosition.equals( gtCoordVect ); } ),
			tiles: this.getTile( globalX, globalY )
		};
	}

	/**
	 * Creates a new chunk at ( cx, cy )
	 * @param {Number} cx ChunkX
	 * @param {Number} cy ChunkY
	 */
	createChunk( cx,cy ){
		var self = this,
			chunkActor = new ChunkActor( self, this.chunkSize,new Vector(cx,cy) ),
			chunk = chunkActor.chunk;
			
		nestedIncriment([0,0],[this.chunkSize,this.chunkSize],(tileX,tileY)=>{
			self.generateTile(chunk,tileX,tileY);
		});

		self.map.placeObject( cx, cy, chunk );

		// Depreciated
		this.chunkNeedsPrerender.push(chunk);
		this.chunks.push(chunk);

		if(cfg.debug_chunk_load_mode=="sync"){
			document.title = self.chunks.length;
			//chunk.renderer.t3_drawProtocol();
		}

		//self.adjustRegionalBounds( cx, cy );
		//self.adjustBatchingCanvas();
		return chunk;
	}
	
	
	/**
	 * This is called to generate chunks by placing down some tiles
	 * @param {TileMap} chunk 
	 * @param {Integer} tileX 
	 * @param {Integer} tileY 
	 */
	generateTile( chunk,tileX,tileY ){
		var coords = chunk.chunkRelCoordsToGlobalRelCoords( new Vector( tileX, tileY ) );
		// generate stone
		var elevation = this.generation.getElevationAt(coords.x, coords.y)
		if( elevation >= cfg.generation_stone_threshold){
			var n = Math.floor(elevation*10);
			if( n % 2 == 0 ){
				chunk.t3_placeTile(Townsend.tiles.stone, tileX,tileY);
			}else{
				chunk.t3_placeTile(Townsend.tiles.stoneMeta1, tileX,tileY);
			}
		}else if( elevation <= -cfg.generation_stone_threshold){
			if(elevation <= -cfg.generation_stone_threshold-0.05){
				chunk.t3_placeTile(Townsend.tiles.water, tileX,tileY);
				return;
			}
			chunk.t3_placeTile(Townsend.tiles.sand, tileX,tileY);
			return;
			if (Math.random() <= cfg.world_treePlacementModifier) {
				chunk.t3_placeTile(Townsend.tiles.berryBush, tileX,tileY);
			}
		}
	}

	createNewMap(){
		var self = this;
		nestedIncriment([-Math.floor( self.mapLength/2 ),-Math.floor( self.mapLength/2)],[ self.mapLength/2 ,self.mapLength/2],( cx, cy )=>{
			var chunk = self.createChunk(cx,cy);
			self.totalChunks++;
			// Make sure it doesn't load over the memory limit
			Townsend.safety.heapWatch();
		});
	}








	/////////////////
	// Depreciated //
	/////////////////

	adjustRegionalBounds(cx, cy){
		var globalOffsetX = cx*this.chunkSize*16, // 16 is the tile width
			globalOffsetY = cy*this.chunkSize*16;
		
		this.lastTopLeftBound = this.topLeftBound.copy();
		this.lastBottomRightBound = this.bottomRightBound.copy();

		// Determine if the bounds require change
		if(globalOffsetX<this.topLeftBound.x){ this.topLeftBound.x = globalOffsetX; this.boundsChanged = true; }
		if(globalOffsetX>this.bottomRightBound.x){ this.bottomRightBound.x = globalOffsetX; this.boundsChanged = true;}
		if(globalOffsetY<this.topLeftBound.y){ this.topLeftBound.y = globalOffsetY; this.boundsChanged = true;}
		if(globalOffsetY>this.bottomRightBound.y){ this.bottomRightBound.y = globalOffsetY; this.boundsChanged = true;}

		this.topLeftBoundResizeDiff = this.lastTopLeftBound.subtract( this.topLeftBound );
	}

	adjustBatchingCanvas(){
		if( this.boundsChanged ){
			this.boundsChanged = false;
			this.resizeBatchingPlaceholders();
			this.holdBatchInPlaceholders();
			this.adjustRegionDimensions();
			this.resizeBatchingCanvases();
			this.restorePreviousBatches();
		}
		
	}

	resizeBatchingPlaceholders(){
		Townsend.canvases.batchLowerResizePlaceholder.height = this.height;
		Townsend.canvases.batchLowerResizePlaceholder.width = this.width;
		Townsend.canvases.batchOverflowResizePlaceholder.height = this.height;
		Townsend.canvases.batchOverflowResizePlaceholder.width = this.width;
	}

	/**
	 * Paste already-batched data into the placeholders to prevent the need to re-render
	 */
	holdBatchInPlaceholders(){
		Townsend.CVSCTX.batchLowerResizePlaceholder.clearRect( 0,0,Townsend.canvases.batchLower.width, Townsend.canvases.batchLower.height );
		Townsend.CVSCTX.batchOverflowResizePlaceholder.clearRect( 0,0,Townsend.canvases.batchOverflow.width, Townsend.canvases.batchOverflow.height );
		Townsend.CVSCTX.batchLowerResizePlaceholder.drawImage( Townsend.canvases.batchLower, 0, 0 );
		Townsend.CVSCTX.batchOverflowResizePlaceholder.drawImage( Townsend.canvases.batchOverflow, 0, 0 );
	}

	/**
	 * Adjusts some internal values for further calculation
	 */
	adjustRegionDimensions(){
		this.width = Math.abs( this.topLeftBound.x ) + this.bottomRightBound.x;
		this.height = Math.abs( this.topLeftBound.y ) + this.bottomRightBound.y;
		this.origin = new Vector( -this.topLeftBound.x, -this.topLeftBound.y );
	}

	/**
	 * Resizes the batching canvases
	 */
	resizeBatchingCanvases(){
		Townsend.canvases.batchLower.height = this.height;
		Townsend.canvases.batchLower.width = this.width;
		Townsend.canvases.batchOverflow.height = this.height;
		Townsend.canvases.batchOverflow.width = this.width;
		Townsend.CVSCTX.batchLower.clearRect( 0,0,Townsend.canvases.batchLower.width, Townsend.canvases.batchLower.height );
		Townsend.CVSCTX.batchLower.clearRect( 0,0,Townsend.canvases.batchOverflow.width, Townsend.canvases.batchOverflow.height );
	}

	/**
	 * Restores previously pre-rendered batches to the newly resized canvases
	 */
	restorePreviousBatches(){
		Townsend.CVSCTX.batchLower.drawImage( Townsend.canvases.batchLowerResizePlaceholder, this.topLeftBoundResizeDiff.x, this.topLeftBoundResizeDiff.y );
		Townsend.CVSCTX.batchLower.drawImage( Townsend.canvases.batchLowerResizePlaceholder, this.topLeftBoundResizeDiff.x, this.topLeftBoundResizeDiff.y );
	}

	initialBatchRender(){
		while( this.chunkNeedsPrerender.length!=0 ){
			document.title = `Chunks left to prerender: ${this.chunkNeedsPrerender.length}`;
			this.chunkNeedsPrerender.pop().batchRender(  );
		}
	}
	
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/chunk.js */


class ChunkActor extends Actor{
    constructor(world, size, positionVector){
        super("chunk");
        this.chunk = new Chunk( world, size, positionVector );
        this.addIdentity(positionVector.toString());
    }
}

class Chunk extends TileMap{
    constructor( world, size, positionVector ){
        super( size, size, {tile:Townsend.tiles.default, metadata:{}} );
        this.position = positionVector;
        this.size = size;
        this.world = world;
        this.entities = [];
        this.globalTileOrigin = this.position.scale( this.size  );

        // Iterative access of tiles that use unique intervals of sprite updates
        this.uniqueTileCases.map(( goodName )=>{ // Super good name!
            this[goodName.ref] = {};
            this[goodName.ref+"Keys"] = [];
        }, this);

        this.renderer = new ChunkRenderer( this );
    }

    get uniqueTileCases(){
        return [
            {prop:"isSpecial", ref:"specialTiles"},
            {prop:"isDynamic", ref:"dynamicTiles"},
            {prop:"isNeighbourDependent", ref:"neighbourDependentTiles"},
            {prop:"isTickDependant", ref:"tickDependantTiles"},
        ]
    }

    chunkRelCoordsToGlobalRelCoords( tCoordVect ){
        return tCoordVect.add( this.position.scale( this.size ) );
    }

    /**
     * 
     * @param {Number} tick total ticks 
     */
    update( tick ){

    }

    createPayload( tile, metadata ){
        return {tile:tile, metadata:metadata}
    }

    t3_placeTile( tile, x, y ){
        var location = new Vector(x, y);

        var occupiedNode = this.getObject( x, y );
        if( occupiedNode ){
            occupiedNode.payload.tile.sprite.t3_clearRenderingSpace( this, location );
        }

        this.placeObject( x, y, this.createPayload( tile, tile.defaultMetadata ) ); /// Haha what
        this.assignToLabels( tile, location );

        this.markTileForRendering( tile, location );
        
        this.updateKeys()

        tile.eventEmitter.emit( "placed", tile, this.chunkRelCoordsToGlobalRelCoords( location ), this.world );
    }

    markTileForRendering( tile, location ){
        this.renderer.tilesNeedRendering.push( Chunk.createTileNode( tile, location ) );
    }

    updateKeys(){
        this.specialTilesKeys = Object.keys( this.specialTiles );
        this.dynamicTilesKeys = Object.keys( this.dynamicTiles );
        this.neighbourDependentTilesKeys = Object.keys( this.neighbourDependentTiles );
        this.tickDependantTilesKeys = Object.keys( this.tickDependantTiles );
    }

    assignToLabels( tile, location ){
        // Super good name!
        this.uniqueTileCases.map( (goodName)=>{
            if(tile[goodName.prop]){
                this[goodName.ref][location.string] = Chunk.createTileNode( tile, location );
            }
        },this )
    }

    // TODO finish
    t3_removeObject( x, y ){
        this.removeObject( x, y );
    }


    static createTileNode( tile, position ){
        return {position:position, tile:tile};
    }

    /**
     * Get the global position for a tile within a chunk.
     * Useful for determining where to draw a tile for batch rendering
     * @param {Number} tileX x coordinate of a tile
     * @param {Number} tileY y coordinate of a tile
     * @returns CoordinateVector
     */
    getTileGlobalPosition( tileX, tileY ){
        var xCoordinate = this.size * this.position.x + tileX + this.world.origin.x/cfg.tile_size;
        var yCoordinate = this.size * this.position.y + tileY + this.world.origin.y/cfg.tile_size;
        return new CoordinateVector( xCoordinate, yCoordinate );
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/inventory.js */
class Inventory{
    constructor( capacity ){
        this.itemStacks = [];
        this.itemStackSet = new Set();
        this.capacity = capacity;
        this.currentCapacity = 0;
    }

    refreshItemStackSet(){
        this.itemStacks.map( ( itemStack )=>{
            this.itemStackSet.add( itemStack.item.identityString );
        },this);
    }

    includes( resourceIdentity ){
        return this.itemStackSet.has( resourceIdentity );
    }

    getNonfullItemStack( itemIdentity ){
        var out = null;
        if( this.itemStackSet.includes() )
        return out;
    }

    /**
     * 
     * @param {Number} index 
     * @returns the removed itemStack
     */
    removeItemStack( index ){
        var itemStack = this.itemStacks.splice(index, 1)[0];
        this.refreshItemStackSet();
        this.currentCapacity-=itemStack.stackSize;
        return itemStack;
    }

    /**
     * 
     * @param {ItemStack} itemStack
     * @returns overflowItemStack
     */
    addItemStack( itemStack ){
        itemStack.inventory = this;
        itemStack.index = this.itemStacks.push(itemStack);
        var overflow = itemStack.stackSize + this.currentCapacity - this.capacity;
        this.refreshItemStackSet();
        if( overflow > 0 ){
            return itemStack.split( overflow );
        }
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/render/cursorinteractioncontext.js */
// TODO integrate

class CursorInteractionContext {
	/**
	 * Defines a context for cursor interactions, not limited to canvas
	 * @param {HTMLElement} element the element this context will be bound to
	 */
	constructor( _ViewContext, element ) {
		var self = this;


		// Setup this instance
		self.propipe = new PropertyPipeline(self)
			.set("parentElement", element)
			.set("parentViewComponent", _ViewContext)
			.set("event", {})
			.set("position", new Vector(0, 0))
			.set("sideLength", cfg.tile_size)
			.set("handlers", {})
			.save();

		self.events = {};

		// Totally overrides onmousemove, use CursorInteractionContext.addHandler( "onmousemove", ()=>{})
		// to add event

		// Add the basic handlers that change .position and .event
		self.addHandler("onmousemove", self.defaultHandler);
	}

	get element(){ return this.parentElement; }

	/**
	 * The default handler
	 * @private
	 * @param {MouseEvent} event the event
	 */
	defaultHandler(self, event) {
		// Change the positions, relative to the parent
		self.position.x = event.clientX;
		self.position.y = event.clientY;
	}

	/**
	 * Emit an event, call all handlers
	 * @param {String} eventname the name of the event you wish to emit, such as onmousemove
	 * @param {MouseEvent} event any event
	 */
	emit(eventname, event) {
		var self = this;
		self.handlers[eventname].map((handler) => { handler(self, event) });
	}

	createListener( eventName ){
		var self = this;
		self.element[eventName] = (event) => { self.emit(eventName, event) };
	}

	/**
	 * Add a handler for an event
	 * @param {String} eventName the name of the event, such as onmousemove
	 * @param {Function} handler the name of the handler
	 */
	addHandler(eventName, handler) {
		var self = this;
		if(!self.handlers[eventName]){
			self.handlers[eventName]=[
				(n, event)=>{ self.events[eventName]=event; }
			];
			self.createListener( eventName );
		}
		self.handlers[eventName].push(handler);
	}
}




/* File source: ../src/Ambitious_Dwarf///src/game/render/mouseupdate.js */



/**
 * Assumes the interaction context is tiled, in structure
 */
class TiledCursorInteractionContext extends CursorInteractionContext{
	/**
	 * A TiledCursorInteractionContext defines a CursorInteractionContext
	 * that gets assigned to tiled entities
	 * @param {HTMLElement} element the element this context will be bound to
	 * @param {Integer} sidelength the sidelength (in pixels) of a tile
	 */
	constructor(_ViewContext ) {
		super(_ViewContext, _ViewContext.renderingManager.canvases.default /* CHange later LOL TODO */ );
		var self = this;
		self.tile = new Vector(0, 0);
		self.viewContext = _ViewContext;
		self.lastMousePosition = new Vector(0,0);
		self.lastClickPosition = new Vector(0,0);
		self.tilePlaceFunction = ( x, y )=> { Townsend.World.placeTile( Townsend.Tile.wall, x, y ); };
	}

	/**
	 * Requirement for VCCCompatableContextInterface
	 * return the context type identifier
	 * @param {ViewComponent} viewComponent parent viewcomponent
	 * @returns {String} the context type identifier
	 */
	vccAssign(viewComponent) {
		this.VCCAssignDefault( viewComponent );

		// Creates new cache package
		viewComponent.createCachePackage("mouseTilePos", this.tile);
		return "TiledCursorInteraction";
	}

	get cursorCorrection(){
		return this.cursorCorrectionVector;
	}

	set cursorCorrection( _Vector ){
		this.cursorCorrection = _Vector;
	}
}





///////////////////
// OLD REFERENCE //
///////////////////
/*

var getMouseTile = function (position) {
	var scalar = Math.pow(Math.E, drawData.scale) * drawData.tileSize;
	var x = position.x / scalar;
	var y = position.y / scalar;
	return new Vector(
		Math.floor(- drawData.offset.x / scalar + x) - 1, Math.floor(- drawData.offset.y / scalar + y) - 1,
	)
}

var mouse = {
	event: {},
	position: new Vector(0, 0),
	tile: new Vector(0, 0)
};

// DIDNT ACCOUNT FOR A MOVING SCREEN
var handleMouseMove = function (event) {
	mouse.position.x = event.clientX;
	mouse.position.y = event.clientY;

	updateMouseLocation(mouse.position);
}

var updateMouseLocation = function (position) {
	mouse.tile = getMouseTile(position);
	document.title = JSON.stringify(mouse.tile);
}

document.body.addEventListener("mousemove", handleMouseMove);

var mousePositionUpdateRoutine;
function mousePositionUpdateRoutineMethod( data ){
	var mouse = data.mouse;
		
	updateMouseLocation( mouse.position );
	
	var range = getViewRange( data.drawData ),
		x = mouse.tile.x,
		y = mouse.tile.y,
		tss = data.drawData.tileScaleSize;
	
	//console.log( range[1] );
	
	// Draw the rectangle
	
}
function createMouseRoutineData(){
	return {
		ctx: renderManager.contexts.rendering,
		drawData: drawData,
		map: map,
		mouse: mouse,
		boxColor: new Color(0, 0, 0, 1)
	};
}

function initializeMouseRoutine() {
	mousePositionUpdateRoutine = new Routine(
		mousePositionUpdateRoutineMethod,
		null, null,
		createMouseRoutineData
	);
	renderManager.addRoutine(STR.ID.rendering, mousePositionUpdateRoutine);
}

*/

/* File source: ../src/Ambitious_Dwarf///src/game/render/mousehandlers.js */
/**
 * Gets the location of the tile which the mouse is hovering on the element
 * ! Requires bound RegionRenderContext
 * @private
 * @param {MouseEvent} event mouse event
 */
function handle_elementHover(self, event) {
    Townsend.viewContext.requestRedraw();
    var tileSize = self.viewContext.tileScaleHelper.tileSize,
        position = self.position, // Mouse position, In pixels
        pixelOffset = self.parentViewComponent.pixelOffset, // View offset, in pixels
        entities = null,desc = "";

    // Some (hard to follow) math going on here
    self.tile = position
        .mutate() 							// Prepare vector for multiple operations
        .subtract( pixelOffset.add( self.viewContext.tileScaleHelper.cursorCorrection ) )			// Translate view-space pixel coordinates to tile-space pixel coordinates
        .scale( 1/tileSize ) 			// Transform tile-space pixel coordinates to tile-space coordinates, with sub-tile precision
        .forEach( Math.floor )				// Get rid of the decimal artifacts
        .forEach( (x)=>{ return x; } )  	// ¯\_(ツ)_/¯
        .unmutate();

    if(Townsend.World && Townsend.tooltip){
        entities = Townsend.World.entities.filter( (x)=>{return x.isHovered;} );
        
        var names = entities.map((e)=>{return e.attributes.name}).join("\n");
        desc+=names;
        if(desc.length >=1){
            Townsend.tooltip.reset();
            Townsend.tooltip.updateDesc( desc );
            Townsend.tooltip.show();
        }else{
            Townsend.tooltip.hide();
        }
    }
    document.title = JSON.stringify(self.tile);
}

/**
 * For global stuff
 */
function handle_globalHover(self, event){
    if(Townsend.tooltip){
        Townsend.tooltip.updatePosition(self.position.x,self.position.y);
    }
    self.lastMousePosition = new Vector( event.clientX, event.clientY );
}

function handle_placeBlock( self, event ){
    if(!Townsend.World) return;

    if( self.mousedown && self.events.onmousedown.button == 0 ){
        if( Object.className(Townsend.World.getTile( ...self.tile.values )) != "WallTile" ){
            self.tilePlaceFunction( ...self.tile.values );
            self.viewContext.frameNeedsUpdate = true;
        }
    }
}

function handle_moveMap( self, event ){
    if(!self.events.onmousedown) return;
    if( self.events.onmousedown.button==1 && self.mousedown ){
        var delta = self.lastMousePosition.subtract( new Vector( event.clientX, event.clientY ) );
        self.viewContext.pixelOffset.values[0]-=delta.x;
        self.viewContext.pixelOffset.values[1]-=delta.y;
        self.viewContext.frameNeedsUpdate = true;
    }
    self.lastMousePosition = new Vector( event.clientX, event.clientY );
}

// Events and stuff

function handle_elementMousedown( self, event ){
    if(!Townsend.World) return;
    Townsend.viewContext.requestRedraw();
    
    self.mousedown = true;
    var objAtLocation = Townsend.World.getTile( ...self.tile.values );
    if( event.button==0 ){
        self.tilePlaceFunction( ...self.tile.values );
    }
    self.lastClickPosition.assign( [event.clientX, event.clientY] );
    self.viewContext.frameNeedsUpdate = true;
}

function handle_elementMouseup( self, event ){
    
    Townsend.viewContext.requestRedraw();
    self.mousedown = false;
}

function handle_debugScrollIncriment( self, event ){
    var signX = Math.sign( event.deltaY ),
        output = "";
    // Debug stuff goes here
    Townsend.VCTSH.scale-=0.25*signX;
    
    document.title = self.viewContext.tileScaleHelper.scale;
    self.viewContext.frameNeedsUpdate = true;
}

/* File source: ../src/Ambitious_Dwarf///src/game/item/item.js */
class ItemStack{
	constructor( item, stackSize, inventory = null, index = 0 ){
		this.item = item;
		this.stackSize = stackSize;
		this.inventory = inventory;
		this.index = 0;
	}

	/**
	 * Split the item stack into two item stacks, or return this item stack
	 * @param {Number} resultStackSize 
	 */
	split( resultStackSize, newInventory=null ){
		resultStackSize = Math.clamp( 1, this.stackSize, resultStackSize );
		if(this.stackSize == resultStackSize){
			if( newInventory ){
				this.assignToInventory( newInventory, this.index );
			}else{
				return this;
			}
		}else{
			this.stackSize-=resultStackSize;
			return new ItemStack( this.item, resultStackSize );
		}
	}

	add( amount ){
		this.stackSize+=Math.clamp( 0, this.capacity, amount );
	}

	remove( amount ){
		this.stackSize-=Math.clamp( 0, this.stackSize, amount );
	}

	/**
	 * Fill up the capacity of this item stack with the other itemStack
	 * @param {ItemStack} itemStack 
	 * @returns overflowItemStack
	 */
	fill( itemStack ){
		var take = Math.min( this.capacity, itemStack.stackSize );
		itemStack.remove( take );
		this.add( take );
		if(itemStack.isEmpty){
			return null;
		}
		return itemStack;
	}

	/**
	 * Transfers this itemstack to a new inventory
	 * @param {*} inventory 
	 * @param {*} index 
	 */
	assignToInventory( inventory, index ){
		var self = this, newIndex;
		if( this.inventory ){
			self = this.inventory.removeItemStack( index );
		}
		inventory.addItemStack( self );
	}

	get isFull(){ return this.stackSize == this.maxStackSize; }
	get isEmpty(){ return this.stackSize >= 0; }
	get maxStackSize(){ return this.item.maxStackSize; }
	// How many more items can be put into this itemstack
	get capacity(){ return this.maxStackSize - this.stackSize; }
}

class ItemSprite extends Sprite{
	constructor( item ){
		super();
		this.item = item;
	}
}

class Item extends Actor{
	constructor( identity, nounName, desc, value = 1, volume = 1 ){
		super();
		this.name = name;
		this.sprite = new ItemSprite(this);
		this.addIdentity("item");
		this.desc = desc;
		this.addIdentity(identity);

		this.value = value;
		this.volume = volume;
	}
	
	get maxStackSize(){ return 128; }

	createItemStack( stackSize ){
		return new ItemStack( this, Math.clamp( 1, this.maxStackSize, stackSize ));
	}
}

/**
 * Resources are any kind of item used for a purpose
 */
class ResourceItem extends Item{
	constructor( ...args ){
		super( ...args );
		this.addIdentity("resource");
	}
}

/**
 * Resources are any kind of item used for a purpose
 */
class ResourceItemOre extends ResourceItem{
	constructor( ...args ){
		super( ...args );
		this.addIdentity("ore");
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/item/items.js */

var Items = {};

Items.log = new ResourceItem( "log", new Noun("log"), STR.itemDesc.log);
Items.stone = new ResourceItem( "stone", new Noun("stone"), STR.itemDesc.stone);
Items.coal = new ResourceItem( "coal", new Noun("coal", "coal"), STR.itemDesc.stone);
Items.ironOre = new ResourceItemOre( "iron", new Noun("iron ore", "iron ore"), STR.itemDesc.stone);
Items.pigIron = new ResourceItem( "pigIron", new Noun("pig iron", "pig iron"), STR.itemDesc.stone);
Items.rust = new Item( "rust", new Noun("rust", "rust"), STR.itemDesc.stone);
Items.iron = new ResourceItem( "iron", new Noun("iron ingot"), STR.itemDesc.stone);

Townsend.Item = Items;

/* File source: ../src/Ambitious_Dwarf///src/game/entity/ai/pathfinding.js */
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
        this.neighbours = Townsend.neighbourOffsetVectorList; // cfg.pathfinding_cost_vh
        this.neighboursDiagonal = Townsend.neighbourDiagonalOffsetVectorList; // cfg.pathfinding_cost_diagonal
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
        var object = Townsend.World.getTile( ...startingPosition.values );
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
                    var object = Townsend.World.getTile( ...nextNodePosition.values );

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

/* File source: ../src/Ambitious_Dwarf///src/game/entity/entity.js */


class Entity extends Actor{
	/**
	 * 
	 * @param {Number} health 
	 */
	constructor(){
		super();
		var self = this;
		
		// Event stuff
		this.eventEmitter = new SimpleEventEmitter( cfg.eventlog_entity_size );

		// Positional stuff
		this.globalTilePosition = new Vector(0,0); // Global coordinates of the entity
		this.previousGlobalTilePosition = this.globalTilePosition.copy();	// Previous coordinates of the entity ( for animation )
		this.nextGlobalTilePosition = new Vector(0,0); // Next coordinate this entity will be in ( for animation )
		this.positionOffset = new Vector(4,-4); // Offset of entity within tile-region
		this.chunk = Townsend.World.getChunkFromTile( ...this.globalTilePosition.values ); // The chunk the entity is currently on
		
		// World interaction stuff
		this.action = null;
		this.actionName = "idle";
		this.tasks = [];
		this.jobs = [];
		this.tick=Math.floor(Math.random()*100);
		this.sprite = new EntitySprite( this );
		this.addIdentity("entity");
		this.idleTimer = Math.floor(Math.random()*100);

		// Creates a list of available actions for this entity 11/5/18
		this.actionsList = Object.getAllOwnPropertyNames(this).filter( ( key )=>{ return key.includes("action_");} );// Why is this useful? I don't know. 11/5/18
		this.tasksList = Object.getAllOwnPropertyNames(this).filter( ( key )=>{ return key.includes("task_");} );// Why is this useful? I don't know. 11/5/18
		this.switchAction("idle");

		// Top it all off
		this.setupEvents();
	}

	/**
	 * 
	 * @param {Number} x Global tile x coordinate
	 * @param {Number} y Global tile y coordinate
	 */
	updatePositionalStates( x, y ){
		this.globalTilePosition.x = x;
		this.globalTilePosition.y = y;
		this.chunk = Townsend.World.getChunkFromTile( ...this.globalTilePosition.values );
	}

	/**
	 * 
	 * @param {Number} x Tile X
	 * @param {Number} y Tile Y
	 */
	moveTo( x, y ){
		this.updatePositionalStates( x, y );
	}
	
	task_idle(){
		this.idleTimer = Math.floor(Math.random()*100);
	}

	resetIdleTimer(){
		this.idleTimer = Math.floor(Math.random()*100);
	}



	/**
	 * 11/5/18
	 * Why does moveTo and teleportTo do the same thing...
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	teleportTo( x, y ){
		this.updatePositionalStates( x, y );
	}

	update( tick ){
		this.isHovered = this.globalTilePosition.equals( Townsend.VCCUR.tile );
		this.actionProtocol();
	}

	actionProtocol(){
		this.tick++;
		this.action();
	}

	


	/**
	 * Actions are carried out every update tick ( 20 times per second );
	 */

	 /**
	  * 
	  * @param {String} actionID The id of the action
	  */
	switchAction( actionID ){
		var actionFunctionAccessKey = `action_${actionID}`;
		if(this[actionFunctionAccessKey]){
			this.action = this[actionFunctionAccessKey];
			this.actionName = actionID;
			this.eventEmitter.emit("actionSwitch", this, actionID);
		}else{
			this.action = this.action_idle;
			this.actionName = actionID;
		}
	}

	get chunkRelativePosition(){
		var self = this;
		return this.globalTilePosition.forEach( (x)=>{return Math.mod(x, self.chunk.size);} );
	}

	/**
	 * f(x) = tilePosition * tileSize + pixelScaleCoefficient * pixelOffset
	 * 			( Major position )	  +		( Minor position )
	 */
	get globalPixelPosition(){
		return this.globalTilePosition.scale( Townsend.VCTSH.tileSize ).add( this.positionOffset.scale( Townsend.VCTSH.coefficient ) );
	}

	
	////////////
	// EVENTS //
	////////////

	setupEvents(){
		var properties = Object.getAllOwnPropertyNames( this );
		var events = properties.filter( propName => (/^on_\w+$/m).test( propName ) );
		events.map( propName => this.eventEmitter.on( propName.split("on_")[1], this[propName] ), this );
	}
}


/* File source: ../src/Ambitious_Dwarf///src/game/entity/living.js */
// This mood is a mood. 11/5/18
class Mood{
	constructor(level, desc){
		this.verb = "mood";
		this.desc = desc;
	}
}

class UpsetMood extends Mood{
	constructor(level, desc){
		super( level, desc );
		this.verb = "upset";
		this.desc = desc;
	}
}

const LivingEntityEvents = [
	"walkingDestinationReached", // When an entity reaches a destination
	"walkingInterruptedUnaccountedObstacle", // When an entity is walking, but is stopped by a new obstacle
	"walkingStepTaken",
	"walkingStart",
	"moveStart",

	"pathfindingStart",
	"pathfindingPathFound",
	"pathfindingPathNotFound",

	"actionBeginIdle",
	"actionBeginWalking",
	"actionDestinationReached",

	"jobBegin",
	"jobCanceled",
	"jobDone",
	"jobInterrupted"
];


class AttributeManagerEntityLiving{
    constructor( entity ){
        // Higher level stuff 11/5/18
        this.entity = entity;
        this.health = 100;
		this.sex = ([0,1]).randomElement();
		this.name = "living entity";
		this.level = 1;
		this.hungerLevel = 0; // 0 = not hungry, 10 = starving
		this.thirstLegvel = 0; // 0 not thirsty, 10 severely dehydrated
		this.performance = {
			strength: 1,	// Determines inventory size
			endurance: Math.floor( Math.random()*10 ),	// Determines
			agility: 5+Math.floor( Math.random()*10 ),		// Determines walking speed
			charisma: 1 	// Determines how much other entities like this entity
		};
    }

    // Hard cap on movementspeed is 5 ticks per tile
	get ticksPerTileTransition(){
		return Math.max( 5, 20-this.performance.agility );
	}
	
	get pixelLocation(){
		return this.entity.tilePositionDiff.scale(
			(this.entity.ticksSinceLastTileTransition) /
			this.ticksPerTileTransition
		).scale(Townsend.VCTSH.tileSize);
	}
    
    get tileTransitionInterval(){
		return cfg.tile_size / this.ticksPerTileTransition;
    }
}

class MovementManagerEntityLiving{
    constructor(){

    }
}

/**
 * Manages the actions of an entity
 */
class ActionManagerEntityLiving{
    constructor( entity ){
        this.entity = entity;
    }
}

class EntityLiving extends Entity{
	constructor( AttributeManager = AttributeManagerEntityLiving, ActionManager = ActionManagerEntityLiving, MovementManager = MovementManagerEntityLiving ){
        super();
        this.attributes = new AttributeManager( this );
        this.actions = new ActionManager( this );
        this.movements = new MovementManager( this );
        // Walking stuff
		this.pathfindingErrorHandler = new PathfindingErrorHandler();
		this.pathfindingAI = new PathfindingAI( EntityLiving.pathfindingDetectObsticle, this.pathfindingErrorHandler );
		this.pathfindingPromise = null;
		this.walkStartTick = 0;
		this.tilePositionDiff = new Vector(0,0);

		this.inventory = new Inventory(1);

		/**11/5/18
		 * Disambiguation
		 * Actions: The do's of an entity (per tick)
		 * Protocols: The how-to-do's of an entity
		 * Tasks: High level stuff ( build this, find that )
		 * 
		 * Tasks > Protocols > Actions > State changes
		 */
        
	}
	
	resetIdleTimer(){
		this.idleTimer = this.idleTimer = Math.max( Math.floor(Math.random()*100)-this.attributes.performance.endurance*8, 10 );
	}
    
    /**
	 * 
	 * @param {Tile} tile 
	 * @returns {Boolean} true -> is not obstacle
	 */
	static pathfindingDetectObsticle( tile ){
		return tile ? !tile.isObstacle : tile;
    }
    
    /**
	 * 
	 * @param {Number} x Global Tile Coordinate
	 * @param {Number} y Global Tile Coordinate
	 */
	task_move( x, y ){
		var self = this;
		self.eventEmitter.emit( "moveStart", self, x, y );
		this.pathfindingPromise = this.pathfindingAI.startPathfinding( this.globalTilePosition, new Vector( x, y ) );
		self.eventEmitter.emit( "pathfindingStart", self, self.pathfindingPromise );

		// Pathfinding promise handler
		this.pathfindingPromise.then( ( pathfindingNodeAtDestination )=>{
			self.eventEmitter.emit( "pathfindingPathFound", self, pathfindingNodeAtDestination );
			// Expand the path into an array
			self.pathfindingAI.expandPath( pathfindingNodeAtDestination );
			self.nextGlobalTilePosition = self.pathfindingAI.path.pop()
			this.tilePositionDiff = this.globalTilePosition.subtract( this.nextGlobalTilePosition ).scale(-1);
			// Start walking!
			self.eventEmitter.emit( "actionStartWalking", self );
			self.switchAction("walk");
		},
		( pathfindingError )=>{
			self.switchAction("idle");
			self.eventEmitter.emit( "pathfindingPathNotFound", self, pathfindingError );
			// Handle pathfinding errors here
		});
		//this.moveTo( x, y );
    }
    
    action_idle(){
		if( this.idleTimer!=0 ){
			this.idleTimer--;
			return;
		}
		this.resetIdleTimer();
		//this.eventEmitter.emit( "actionStartIdle", self );
		var idleWalkLocation = this.globalTilePosition.forEach( ( n )=>{
			return -cfg.entity_roam_dist/2 + Math.floor(Math.random()*cfg.entity_roam_dist+0.5) + n ;
		});
		this.task_move( ...idleWalkLocation.values );
	}

	action_repathfinding(){

	}

	

	get ticksSinceLastTileTransition(){
		return this.tick-this.walkStartTick;
	}

	action_walk(){
		var self = this;
		// Change globalTilePosition once f(t) == 0 [11/6/18]
		 // f(t) = t mod max(5, 20-a) [11/6/18]
		if(( this.ticksSinceLastTileTransition ) % ( this.attributes.ticksPerTileTransition ) == 0){

			// Grab the next position of the entity [11/6/18]
			this.walkStartTick = this.tick; // Reset for delta tick [11/6/18]
			

			

			this.moveTo( ...this.nextGlobalTilePosition.values );
			this.nextGlobalTilePosition = this.pathfindingAI.path.pop()
			this.tilePositionDiff = this.globalTilePosition.subtract( this.nextGlobalTilePosition ).scale(-1);
			// Find new path if current one is blocked by obstacle [11/6/18]
			if( !EntityLiving.pathfindingDetectObsticle( Townsend.World.getTile( ...this.nextGlobalTilePosition.values ) ) ){

				// Switch the action, handle the event
				this.tilePositionDiff = new Vector(0,0);
				this.switchAction("repathfinding");
				this.eventEmitter.emit( "walkingInterruptedUnaccountedObstacle", self, this.pathfindingAI.destination );
				return;
			}
			// Stop this action once the destination is reached [11/6/18]
			if(this.pathfindingAI.path.length==0){
				this.switchAction("idle");
				this.eventEmitter.emit( "actionDestinationReached", self );
				this.tilePositionDiff = new Vector(0,0);
				return;
			};
		}
    }
    
    on_walkingInterruptedUnaccountedObstacle( destination ){
		this.task_move( destination.values );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/entity/person.js */
function parseCensusFile( filePath ){
	return FS.readFileSync(filePath).toString().split("\n").map( (x)=>{ var n = x.split(" ")[0]; if(n){ return n.toLowerCase().capitalize(); } } ).filter( (x)=>{ return !!x; } );
}

const NAMES_MALE = parseCensusFile( "./src/assets/lists/dist.male.first.txt" )
const NAMES_FEMALE = parseCensusFile("./src/assets/lists/dist.female.first.txt");
const NAMES_LAST = parseCensusFile("./src/assets/lists/dist.all.last.txt");


class PersonBuildJob extends EntityJob{
	constructor( destination, TileClass ){
		super( destination );
		this.TileClass = TileClass;
	}
	
	createProtocolInstance(){
		return [
			{task:"collectResources", params:TileClass }
		]
	}
}

class EntityPerson extends EntityLiving{
	constructor(  ){
		super();
		this.sprite = new EntitySpritePerson( this );
		this.profession = "person"; // The highest level job this person has
		this.addIdentity("person");
		this.inventory = new Inventory( 4 );
		this.skills = {
			
		};

		/**
		 * People have values which determine their behavour
		 * Values range from 0 to 10, 0 being not valued to 10 being
		 */
		this.values = {
			honor: 0,	// Will determine choices that are selfless 
			pride: 0,	// Will determine choices that require self-sacrifice
			respect: 0, // Will determine how much people like this person
			selfRespect: 0, // Will determine person's choice of self expression
			addicted: 0, // Applies to whether or not a person will get addicted to substances 
			promiscuous: 0,
			anxious: 0
		};

		this.diseases = [];

		this.giveNewName();
	}

	giveNewName(){
		var list = this.attributes.sex ? NAMES_FEMALE : NAMES_MALE ;
		this.attributes.name = `${list.random()} ${NAMES_LAST.random()}`;
	}

	/**
	 * 
	 * @param {String} resourceIdentifier Actor.identityString
	 */
	task_collectResources( resourceIdentifier ){

	}

	static get jobList(){
		return [
			"miner",
			"farmer"
		]
	}

	static get skillList(){
		return [
			"mining",

			"building",

			"farming",
			"planting",
			"harvesting",

			"foraging",

			"lumbering"
		]
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/tile.js */
/**
 * Default tile
*/
class Tile extends Actor{
	constructor(){
		super();
		this.needsVisualUpdate = false;
		this.tileSize = cfg.tile_size;
		this.eventEmitter = new SimpleEventEmitter(0);

		// Template properties
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighbourDependent = false; // If the sprite state depends on it's neighbours
		this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
		this.sprite = new TileSprite( this );
		this.isSpecial = false;

		// Physical properties
		this.isObstacle = false;

		this.addIdentity("tile");

		// Log when a new tile is created
		//ExecLims.log.tileCreate.call( this );

		/**
		 * 11/5/18
		 * I want to make pixel-space pathfinding a thing
		 * Best way to do so might be to make 2 new classes, TilePath and TilePathCollection
		 * which store the path between each entry point and the center point of a tile
		 * 
		 * and a TilePathCollectionCollection which stores paths for each type of tile
		 * accessed by a string formed from the tile's identites (which is not unique for different tile types)
		 */
		this.entryPoints = [
			new Vector( 0, 8 ),
			new Vector( 15, 8),
			new Vector( 8, 0),
			new Vector( 8, 15)
		]
		this.centerPoint = new Vector( 8, 8 );

		// Top it all off
		this.setupEvents();
	}

	get name(){ return "tile"; }

	////////////
	// EVENTS //
	////////////

	/**
	 * Setup the event listeners
	 */
	setupEvents(){
		var properties = Object.getAllOwnPropertyNames( this );
		var events = properties.filter( propName => (/^on_\w+$/m).test( propName ) );
		events.map( propName => this.eventEmitter.on( propName.split("on_")[1], this[propName] ), this );
	}
	
	/**
	 * Default metadata of this tile
	 */
	get defaultMetadata(){
		return {};
	}

	/**
	 * Get a list of neighbour offsets
	 */
	static get neighbours(){
		return Townsend.neighbourOffsetVectorList;
	}

	/**
	 * When the mouse is hovered over a tile
	 */
	static create_event_hovered(){}
	on_hovered( event ){
		
	}

	/**
	 * When a tile is constructed by an entity
	 * @param {event_constructed} event 
	 */
	on_constructed(  ){

	}

	/**
	 * When a tile is spawned in ( spawn routines, other tiles, or by cheating)
	 */
	on_spawned(){

	}

	on_placed( gCoordVect, world ){
		if(!this.world){this.world = world;}
        var position = gCoordVect;
        Townsend.neighbourOffsetVectorList.map( ( offsetVector )=>{
            var neighbourLocation = position.add(offsetVector);
            if( this.world.tileExists(...neighbourLocation.values)){
				var extendedTileData = this.world.getTilePlus( ...neighbourLocation.values );
				if( extendedTileData.tile.isNeighbourDependent ){
					extendedTileData.chunk.markTileForRendering( extendedTileData.tile, extendedTileData.chunkRelPosition );
				}
            }
        });
    }

	/**
	 * When a tile is removed
	 */
	on_removed(  ){

	}

	/**
	 * When an entity goes on top of a tile
	 */
	on_entity_above(  ){

	}

	/**
	 * When an entity is next to a tile
	 */
	on_entity_adjacent(  ){

	}

	/**
	 * when a tile gets destroyed by means of destruction
	 */
	on_destroyed(  ){

	}



	// Fun stuff
	/**
	 * Context menu > inspect
	 */
	get userInteraction_inspect(){
		return "This is a tile! Nothing out of the ordinary.";
	}




	/////////////////
	// DEPRECIATED //
	/////////////////
	/*
	static DEPRECIATED_drawBasic( drawData ){
		var tilesheet = data.TS.DFDefault,				// Tilesheet
			parent = data.parent,				// Parent data
			viewContext = data.viewContext,
			tileSize = viewContext.tileScaleHelper.tileSize,
			location = this.getTileSpriteLocation( tilesheet, drawData );	// Tile location data
			
		//this.drawGround( data );
		
		tilesheet.drawTile(
			parent.ctx,
			location,
			new Vector(	data.to.x, data.to.y ),
			tileSize,
			tileSize);
	}

	DEPRECIATED_prerender( drawData ){
		var renderingMan = drawData.viewContext.renderingManager,
			self = this;
		// Allocate an area for prerendering to occur
		self.prerenderIndex = renderingMan.requestCanvasAllocation( "prerendering", self.prerenderWidth );
		self.prerendersTypes.map( (prerenderIdentity, index)=>{
			var prerenderLocationData = {
				index: self.prerenderIndex,
				height: self.prerenderHeight*index
			};
			self.prerenders[prerenderIdentity] = prerenderLocationData;
			self[`prerender_${prerenderIdentity}`]( drawData, prerenderLocationData );
			
		});
		self.isPrerendered = true;
	}

	
	DEPRECIATED_drawGround( data ){
		var tilesheet = data.parent.TS.grass,		// Tilesheet
			routineData = data.parent,				// Parent data
			viewContext = data.viewContext,			// Draw Data
			location = tilesheet.getTileAt( 1, 0 );
		tilesheet.drawTile(
			routineData.viewContext.renderingManager.contexts.ground,
			location, data.to,
			viewContext.tileScaleHelper.tileSize,
			viewContext.tileScaleHelper.tileSize );

		//this.check_hovered( drawData );
	}


	DEPRECIATED_drawRoutine( dataPacket ){
		if(this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready){
			this.prerender( dataPacket );
		}
		this.draw( dataPacket );
	}

	DEPRECIATED_draw( data ){
		this.drawGround( data );
	}
	
	DEPRECIATED_drawHovered( data ){
		var tilesheet = data.parent.TS.DFDefault,				// Tilesheet
			routineData = data.parent,				// Parent data
			viewContext = data.viewContext,
			tileSize = viewContext.tileScaleHelper.tileSize;			// Draw Data
		
		routineData.ctxPipeline
			.setFillStyle( [ new Color(200,255,255,0.3).rgbaString ] )
			.beginPath()
			.rect([
				data.to.x,
				data.to.y,
				tileSize, tileSize])
			.fill();
		
		tilesheet.drawTile(
			routineData.ctx,
			location, data.to,
			tileSize,
			tileSize );
	}

	DEPRECIATED_needsRedraw(){
		return false;
	}

	// Batch rendering nonsense //
	get DEPRECIATED_batchContextOverflow(){return Townsend.viewContext.renderingManager.contexts.batchOverflow;}
	get DEPRECIATED_batchContextLower(){return Townsend.viewContext.renderingManager.contexts.batchLower;}
	DEPRECIATED_batchInstanceRenderProtocol( to ){
		to = to.scale( this.tileSize );
		this.batchInstanceDrawOverflow(to.subtract(Townsend.batch.overflowOffset));
		this.batchInstanceDrawLower(to);

	} ^/

	/**
	 * Changed for every instance of a new tile object
	 * Draw call for the overflow part of the tile sprite
	 * @param {CoordinateVector} to 
	 */
	/*
	DEPRECIATED_batchInstanceDrawOverflow( to ){}
	*/
	/**
	 * Changed for every instance of a new tile object 
	 * Draw call for the lower part of the tile sprite
	 * @param {CoordinateVector} to 
	 */
	/*
	DEPRECIATED_batchInstanceDrawLower( to ){}

	DEPRECIATED_experament_grassFlow(){
		states = 16,
		rows = 2,
		statesPerRow = states/rows,
		a = Math.floor((Math.floor(data.time*cfg.sprite_ground_flowFrameCoefficient)+(data.to.x-Math.sin(data.to.y/cfg.sprite_ground_flowSizeCoefficient))*states+(data.to.y)*states)%states),
		location = tilesheet.getTileAt( cfg.sprite_ground_y, a );	// Tile Sprite location
		//Math.round(7+(Math.abs(Math.sin( Math.floor(viewContext.frameCounter/10) + Math.pow((data.to.x+data.to.y),2)/4)))*4) 
		Townsend.analytics.flow = a;
	}
	*/
}



/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/types/forageable.js */
class ForageableTile extends Tile{
    constructor(){
        super();
        this.isForageable = true;
    }

    on_foraged(){
        
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/empty.js */
class TileEmpty extends Tile{
	constructor(){
		super();
		this.addIdentity("empty");
	}
	
	draw( data ){}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/simple/wall.js */
class TileWall extends Tile{
    constructor(){
        super();
        this.isWall = true;
        this.isObstacle = true;
        this.isNeighbourDependent = true;
        this.sprite = new TileSpriteWall( this );

        this.addIdentity("wall");
    }
    get name(){ return "Stone Wall"; }
    get isBuildable(){return true;}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/simple/stone.js */
class TileStone extends Tile{
    constructor( meta=0 ){
        super();
        // Todo fix sprites for meta
        this.meta = meta;
        this.sprite = new TileSpriteMetaNeighbourDependent( this,
            Townsend.spritesheet.walls, Townsend.spritesheet.walls.getSpriteAt(3,0) );
        this.sprite.staticGroundLocation = this.sprite.staticGroundSource.getSpriteAt(0,5);
        this.isObstacle = true;
        this.addIdentity("stone");
        this.addIdentity(`meta${meta}`)
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/simple/sand.js */
/**
 * Sand tile
 * This is the first implementaion of 0 depth spritesheet globals
 */
class TileSand extends Tile{
    constructor(){
        super();
        this.sprite = new TileSpriteSand( this, SSFloors, SSFloors.getTile("atlas-sand") );
        this.addIdentity("sand");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/simple/water.js */
/**
 * Water tile
 */
class TileWater extends Tile{
    constructor(){
        super();
        this.sprite = new TileSpriteWater( this, SSFloors, SSFloors.getTile("atlas-water") );
        this.addIdentity("water");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/wild/bush.js */


class TileBush extends ForageableTile{
    constructor(){
        super();
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighbourDependent = false; // If the sprite state depends on it's neighbours
        this.sprite = new TileSpriteBush( this );
        this.addIdentity("bush");   
        this.isObstacle = true;
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/wild/berrybush.js */
class TileBerryBush extends TileBush{
    constructor(){
        super();
        this.addIdentity("berry");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/types/storage.js */
class StorageTile extends Tile{
    constructor(){
        super();

        // Template properties
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighbourDependent = false; // If the sprite state depends on it's neighbours
        this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
        this.isSpecial = true;
        
        // Physical properties
		this.isObstacle = false;

        this.addIdentity("storage");
        
        this.inventory = new Inventory( this.maxItemStack );
        
    }

    get maxItemStack(){ return 16; }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/objects/stockpile.js */
class TileStockpile extends StorageTile{
    constructor(){
        super();
        this.isNeighbourDependent = true;
        this.sprite = new TileSpriteStockpile( this );
        //this.sprite = new TileSpriteNonSolid( this, Townsend.spritesheet.objects, Townsend.spritesheet.objects.getSpriteAt( 0, 3 ) );
        this.isSpecialTile = true;
        this.addIdentity("stockpile");
    }
    get name(){ return "Stockpile"; }
    get isBuildable(){return true;}

    get isFull(){
        return this.items == this.maxItemAmount;
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/simple/grass.js */
class TileSpriteGrass extends TileSprite{
	constructor( tile ){
		super( tile );
		this.spritePixelOffset = new Vector( 0,4 );	// The offset of a sprite
        this.spritePixelOverflowOffset = this.calculateOverflowOffset(); // This is what Chunk.canvasOverflow is for
	}

	t3_draw( chunk, pCoordVect ){
		// Ground Grass tile
		if( Math.random() < 0.05){
			this.staticGroundLocation = Townsend.spritesheet.grounds.getTileAt(0,1+Math.floor(Math.random()*2));
		}else{
			this.staticGroundLocation = this.defaultStaticGroundLocation;
		}
		this.t3_drawGround( chunk, pCoordVect );

		// Decals
		var randomSprite, randomSpriteLocation;
		if( false && Math.random() < 0.05){
			// Big plants
			randomSprite= Math.floor(Math.random()* 6);
			this.staticGroundLocation = Townsend.spritesheet.grounds.getTileAt(0,4);
            randomSpriteLocation = Townsend.spritesheet.plants1.getTileAt( 1, randomSprite );
			TileSprite.drawLayeredTile( Townsend.spritesheet.plants1, chunk, randomSpriteLocation, this.spritePixelOffset, this.spritePixelOverflowOffset, pCoordVect );
		}else{
			// Grass overlays
			randomSprite= Math.floor(Math.random()* 6);
			randomSpriteLocation = Townsend.spritesheet.plants1.getTileAt( 4, randomSprite );
			Townsend.spritesheet.plants1.drawTile(
				chunk.renderer.canvasOverflowCtx,
				randomSpriteLocation,
				pCoordVect,
				cfg.tile_size, cfg.tile_size
			);
		}
	}
}

class TileGrass extends Tile{
    constructor(){
        super();
		this.addIdentity("grass");
		this.sprite = new TileSpriteGrass( this );
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/types/resource.js */
class ResourceTile extends StorageTile{
    constructor(){
        super();
        this.addIdentity("resource");
    }

    // Standard 20 ticks per resource
    get ticksPerResource(){ return 20; }

    /**
     * This will give the entity a resource from the tile
     * based on however it's implemented
     * @returns ItemStack
     */
    generateResource(){}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/objects/minehole.js */
class TileMineHole extends ResourceTile{
    constructor(){
        super();
        this.sprite = new TileSpriteNonSolid( this, Townsend.spritesheet.objects, new Vector(0,0) );
    }
    get name(){ return "Minehole"; }
    get isBuildable(){return true;}

    /**
     * @returns ItemStack
     */
    generateResource(){}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/simple/woodpath.js */
class TileWoodPath extends Tile{
    constructor(){
        super();
        this.isNeighbourDependent = true;
        this.sprite = new TileSpriteNeighbourDependent( this,
                Townsend.spritesheet.floors,
                Townsend.spritesheet.floors.getSpriteAt( 6,0 )
            );
        this.addIdentity("wood-path");
    }
    get name(){ return "Wood Path"; }
    get isBuildable(){return true;}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/debug/debugFNSUD.js */
class TileDebugFNSUD extends Tile{
    /**
     * Force neighbour sprite update
     */
    constructor(){
        super();
    }

    get isBuildable(){ return true; }
    get isDebug(){ return true; }
    get name(){ return "force neighbour sprite update"; }

    on_placed( gCoordVect, world ){
		if(!this.world){this.world = world;}
        var position = gCoordVect;
        Townsend.neighbourMergedOffsetVectorList.map( ( offsetVector )=>{
            var neighbourLocation = position.add(offsetVector);
            if( this.world.tileExists(...neighbourLocation.values)){
				var extendedTileData = this.world.getTilePlus( ...neighbourLocation.values );
				extendedTileData.chunk.markTileForRendering( extendedTileData.tile, extendedTileData.chunkRelPosition );
            }
        });
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/tiles.js */
// Definitions

Townsend.tiles.generic = new Tile();
Townsend.tiles.empty = new TileEmpty();
Townsend.tiles.grass = new TileGrass();
Townsend.tiles.wall = new TileWall();
Townsend.tiles.stone = new TileStone();
Townsend.tiles.stoneMeta1 = new TileStone(1);
Townsend.tiles.genericBush = new TileBush();
Townsend.tiles.berryBush = new TileBerryBush();
Townsend.tiles.mineHole = new TileMineHole();
Townsend.tiles.stockpile = new TileStockpile();
Townsend.tiles.woodPath = new TileWoodPath();
Townsend.tiles.sand = new TileSand();
Townsend.tiles.water = new TileWater();
// Debugs
Townsend.tiles.debugFNSUD = new TileDebugFNSUD();









Townsend.tiles.default = Townsend.tiles.grass;
Townsend.Tile = Townsend.tiles;

Object.values(Townsend.tiles).map( (genericTile)=>{
    genericTile.addIdentity("generic");
});

// Categorizing

// Sort out the tiles that can be built
Townsend.buildableTiles = {};
Object.keys( Townsend.tiles ).filter( (key)=>{
    return Townsend.tiles[key].isBuildable;
}).map( ( key )=>{
    Townsend.buildableTiles[key] = Townsend.tiles[key];
} );

// Sort oout the tiles that are made for debugging
Townsend.debugTiles = {};
Object.keys( Townsend.tiles ).filter( (key)=>{
    return Townsend.tiles[key].isDebug;
}).map( ( key )=>{
    Townsend.debugTiles[key] = Townsend.tiles[key];
} );

/////////////////
// Depreciated //
/////////////////

