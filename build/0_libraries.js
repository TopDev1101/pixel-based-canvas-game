/* File source: ../lib/javascript/jsbuilder0.0.1/utils/debug.js */
var thisInitKeys = Object.keys( this );

/**
 * Limits the amount of executions ( calls ) on a function
 * Example:
 * 
 * var limitedLog = new ExecutionLimiter( 10, (...args)=>{ console.log.apply( null, args ) });
 * limitedLog.call( "data" ) // This will only work 10 times
 */
class ExecutionLimiter{
    constructor( times, callback ){
        this.times = times;
        this.executed = 0;
        this.callback = callback;
    }
    call(...args){
        if( this.executed<this.times ){
            this.callback(...args);
            this.executed++;
        }
    }
}

/* File source: ../lib/javascript/jsbuilder0.0.1/utils/string.js */
/**
	Replace all instances within a string
*/
String.prototype.replaceAll = function( query, replacement ){
	var self = this;
	return self.split( query ).join( replacement );
};

String.prototype.capitalize = function(){
	var self = this;
	return self[0].toUpperCase()+self.slice(1);
};

String.prototype.multiply = function( times ) {
	var out = "",
		self = this;
		
	for( var i = 1; i < times; i++ ){
		out+=self;
	}
	return out;
};

String.prototype.shuffle = function(){
	out = this.split("");
	for( var i = 0; i < out.length; i++ ){
		var hold = out[i],
			swap = Math.floor(Math.random()*out.length);
		out[i] = out[swap];
		out[swap] = hold;
	}
	out = out.join("");
	return out;
};

String.prototype.chooseRandomChar = function(){
	return this[ Math.floor( Math.random() * this.length )];
};

function generateUUID() {
	// I wrote this a while ago, It works but only god knows how.
	var basis = new Date().getTime(),
		bin = basis.toString(2),
		var1 = Math.floor(basis * Math.random()).toString(2),
		var2 = Math.floor(basis * Math.random()).toString(2),
		var3 = Math.floor(basis * Math.random()).toString(2),
		clr = (basis * Math.random()).toString(2);

	var timeLow = parseInt(bin.substring(bin.length - 32, bin.length), 2).toString(16),
		timeMid = parseInt(bin.substring(bin.length / 2 - 8, bin.length / 2 + 8), 2).toString(16),
		timeHiAndVar = parseInt(bin.substring(0, 12) + var1.substring(var1.length - 4, var1.length), 2).toString(16),
		clockRand = (parseInt(clr.substring(clr.length - 16, clr.length), 2) | 0x8000).toString(16),
		nodeID = parseInt(Math.floor(Math.pow(bin * var3, 2)).toString(2).substring(0, 48), 2).toString(16);

	return [timeLow, timeMid, timeHiAndVar, clockRand, nodeID].join("-");
}

if( typeof( module ) != "undefined" ){
    module.exports ={
		generateUUID:generateUUID
	};
}

/*
	Defined
	* String.prototype.replaceAll( String query, String replacement );
		-> new String
	* String.prototype.capitalize();
		-> new String
	* String.prototype.multiply( int times );
		-> new String
	* String.prototype.shuffle();
		-> new String;
	* String.prototype.chooseRandomChar();
		-> new Char
	* generateUUID();
		-> new String
*/

/* File source: ../lib/javascript/jsbuilder0.0.1/utils/object.js */
var ObjectUtils = {};

Object.getClassName = function( object ){
	return object.constructor.toString().split("{")[0].replace("class ", "").split(" ")[0];
}

Object.className = Object.getClassName;

Object.combine = function( source, destination ){
   Object.keys( source ).map( ( key )=>{
       destination[ key ] = source[ key ];
   })
}

Object.isUndefined = function( o ){
    return typeof(o) == "undefined";
}

Array.prototype.random = function(){
    return this[Math.floor(Math.random()*this.length)];
}

Object.getAllOwnPropertyNames = function( obj ){
    var props = [];

    do{
        props = props.concat(Object.getOwnPropertyNames(obj));
    }while( obj = Object.getPrototypeOf(obj) );

    return props;
}

/* File source: ../lib/javascript/jsbuilder0.0.1/utils/math.js */
Math.sigma = function( method, iterations ){
    var sum = 0;
    for( var i = 0; i < iterations; i++ ){
        sum+=method(i);   
    }
    return sum;
};

// Special case distance formula
Math.distance = function( x, y, x2, y2 ){
    return Math.sqrt( Math.pow(x-x2,2)+Math.pow(y-y2,2) );
};

Math.sign = function( x ){
    if( x === 0){
        return 1;
    }
    return Math.abs(x)/x;
};

Math.toRadians = function( degrees ){
	return Math.PI/180*degrees;
};

Math.toDegrees = function( radians ){
	return 180/Math.PI*radians;
};


Math.mod = function( x, c ){
	return ( x % c + c ) % c;
};

/**
 * Check if lowerBound <= x <= upperBound
 */
Math.isInRange = function( x, lowerBound, upperBound){
	return ( lowerBound <= x ) && ( x <= upperBound );
};

Math.createSet = function( setSize ){
	var sizes = [ Uint8Array, Uint16Array, Uint32Array ],
		sizeIndex = ( Math.ceil( Math.log2(  Math.log2( setSize ) )) - 3 );
	return new (( sizes[ sizeIndex ] || (( sizeIndex < 0 ) ? Uint8Array : Uint32Array ) ))( setSize, 1 );
};

Math.clamp = function( min, max, val ){
	return Math.min( max, Math.max( val, min ) );
};

Math.lerp = function( n1, n2, x ){
	return (1 - x)*n1 + x * n2;
};

Math.map = function( x, baseLow, baseHigh, newHigh, newLow ){
	return (x - baseLow)/(baseHigh - baseLow) * ( newHigh - newLow ) + newLow;
}

if( typeof( module ) != "undefined" ){ module.exports = Math; }

/*
	Defined
	Math.sigma( Func method, Int iterations );
		-> new Any
	Math.distance( int x, int y, int x2, int y2 );
		-> new Float
	Math.toRadians( Number degrees );
		-> new Float
	Math.toDegrees( Number radians );
		-> new Float
	Math.mod( Int x, Int n );
		-> new Number
	Math.createSet( Int setSize );
		-> Typed array
*/

/* File source: ../lib/javascript/jsbuilder0.0.1/utils/algorithmassist.js */
/*
 * Some functions and methods to assist in creation of algorithms
 */

/**
 * Nested incrimental loops, great for n-dimensional array traversal
 * @param {Integer[]} initialValues The depth of the loops will be based on the length of this array
 * @param {Integer[]} reachValues Simmilar to N
 * @param {Function} callback callback( ...Values )
 */
function nestedIncriment(initialValues, reachValues, callback) {
	// Create a copy of start
	var values = initialValues.map((x) => { return x; }),
		nest = [() => { callback(...values); }];

	// Setup the nest
	incrimentalLoop(0, initialValues.length, (index) => {
		// Hold the previous nest method
		// Build the nest
		nest.push(() => {
			incrimentalLoop(initialValues[index], reachValues[index], (i) => {
				values[index] = i;
				nest[index]();
			});
		});
	});

	// Burn the nest down
	nest[nest.length - 1]();
}

function asyncNestedIncriment(initialValues, reachValues, callback, onDone){
	var values = initialValues.map((x) => { return x; }),
		nest = [() => { callback(...values); }];

	// Setup the nest
	asyncIncrimentalLoop(0, initialValues.length, (index) => {
		// Hold the previous nest method
		// Build the nest
		nest.push(() => {
			asyncIncrimentalLoop(initialValues[index], reachValues[index], (i) => {
				values[index] = i;
				nest[index]();
			});
		});

		if(index>=initialValues.length-1){
			nest[nest.length - 1]();
		}
	});
	
}

/**
 * Simmilar to for( var i = 0; i < n; i++ ){}
 * @param {Integer} startValue Initial value
 * @param {Integer} reach reach this number, exclusively
 * @param {Function} callback callback( i );
 */
function incrimentalLoop(startValue, reach, callback) {
	var output = [];
	for (var i = startValue; i < reach; i++) {
		output.push( callback(i) );
	}
	return output;
}

function asyncIncrimentalLoop(startValue, reach, callback) {
	asyncIncriment( reach, callback, ()=>{}, 0, startValue );
}

asyncIncriment = function( times, callback, done = ()=>{}, waitTime = 0, counter = 0, out = [] ){
	if(counter == times){ done( out ); return out;}
	setTimeout( ()=>{ out.push(callback(counter)); asyncIncriment( times, callback, done, waitTime, counter+1, out ); }, waitTime );
}

asyncBatchIncriment = function( times, batchSize, callback, done = ()=>{}, waitTime = 0, counter = 0, out = [] ){
	if(counter == times){ done( out ); return out;}
	setTimeout( ()=>{
		if(batchSize > times-counter){
			batchSize = times-counter;
		}
		for( var i = 0; i < batchSize; i++){
			out.push(callback(counter));
			counter++;
		}
		asyncIncriment( times, callback, done, waitTime, counter, out );
	}, waitTime );
}

Number.prototype.timesDo = function( callback ){
	return incrimentalLoop( 0, this, callback );
};

Array.prototype.shuffle = function(){
	var self = this;
	var holdForSwap = null;
	var holdForReplace;
	for( var i = self.length-1; i >= 0; i-- ){
		var n = Math.floor( Math.random()*self.length );
		holdForSwap = self[i];
		holdForReplace = self[n];
		self[i] = holdForReplace;
		self[n] = holdForSwap;
	}
};

Array.prototype.localShuffle = function( relativity ){
	var self = this;
	var holdForSwap = null;
	var holdForReplace;
	for( var i = self.length-1; i >= 0; i-- ){
		var n = i - relativity + Math.floor( Math.random()* relativity );
		holdForSwap = self[i];
		holdForReplace = self[n];
		self[i] = holdForReplace;
		self[n] = holdForSwap;
	}
};

Array.prototype.insNextFree = function( val ){
    if( this.freed && this.freed.length > 0){
        this[this.freed.pop()] = val;
    }else{
        this.push( val );
    }
};

Array.prototype.free = function( index ){
    if( typeof(this.freed) == "undefined" ){
        this.freed = [];
    }
    this.freed.push( index );
};

Array.prototype.randomElement = function( randomFunction=Math.random ){
	return this[ Math.floor( randomFunction()*this.length ) ];
}

if( typeof( module ) != "undefined" ){
	module.exports = {
		incrimentLoop: incrimentalLoop,
		incrimentNested: nestedIncriment
	};
}

/* File source: ../lib/javascript/jsbuilder0.0.1/utils/interface.js */
/**
 * An interface defines a set of rules that a class must obey in order to classify
 * as a member of an interface
 */
class Interface {
	constructor(map) {
		this.typeMap = map;
	}

	/**
	 * Confirm that a class (or instance)
	 * @param {__proto__} prototype Instance.__proto__, or Class.prototype
	 */
	confirm(prototype) {
		var n = Object.keys(this.typeMap).map((identifier) => {
			return (typeof prototype[identifier]) == this.typeMap[identifier];
		});
		return n.reduce((a, b) => { return a + b; }) == n.length;
	}
}

if( typeof( module ) != "undefined" ){
	module.exports = Interface;
}

/* File source: ../lib/javascript/jsbuilder0.0.1/containers/routinecollection.js */

class Routine{
	/**
	 * A single routine for the entire routine collection
	 * @param {Function} method Method that will be executed
	 * @param {Function} condition Function that determines if the method will execute, condition( data() )
	 * @param {Number} priority Priority of the routine on the queue
	 * @param {Function} data method( data() )
	 */
	constructor( method, condition, priority, data ){
		// Other is an object which contains data the condition and draw method will use
		// Should be an object of refrences
		var self = this;
		this.priority = priority ? priority : 0;
		this.condition = condition ? condition : ()=>{ return true; };
		this.method = method ? method : ()=>{};
		this.data = data ? ( typeof data == "function" ? data() : data ) : {};
	}

	/**
	 * Execute the routine
	 */
	call(){
		if( this.condition( this.data ) ){
			return this.method( this.data );
		}else{
			return false;
		}
	}
}

class RoutineCollection{ 
	/**
	 * Create a new routine collection
	 * Routine collections are collections of methods
	 * that are called periodically with priority support
	 */
	constructor(){
		var self = this;
		self.routines = [];
	}
	
	/**
	 * Add a new routine to the routinecollection
	 * @param {Routine} routine 
	 */
	addRoutine( routine ){
		this.routines.push( routine );
		this.routines.sort( ( a, b )=>{
			return a.priority > b.priority;
		});
	}
	
	/**
	 * Execute all routines
	 */
	call(){
		this.routines.map( ( routine )=>{
			routine.call();
		})
	}
}

/* File source: ../lib/javascript/jsbuilder0.0.1/containers/vector.js */
/* SNIPPET START

var Vector = Vector ? Vector :  module ? require("./vector.js") : function(...args){ var self = this; args.map( (v,i)=>{ self[("xyzabcdefghijk")[i]]=v;});};

 SNIPPET END */
/**
	Vector class
	By Daniel Tran
	Includes methods for manipulating vectors
	
	Can be used as general array
*/

Math.sigma = Math.sigma ? Math.sigma : function( method, iterations ){
    var sum = 0;
    for( var i = 0; i < iterations; i++ ){
        sum+=method(i);   
    }
    return sum;
}

Object.getClassName = Object.getClassName ? Object.getClassName : function( object ){
	return object.constructor.toString().split("{")[0].replace("class ", "");
}

// Dimensional labels
const DIML = "xyzabcdefghijklmnopqrstuvw";

/**
 * A vector is a mathematical object used in matrix calculations
 * but can also be used to represent points, directions or magnitudes of space.
 * 
 * This class allows it to be used as both
 */
class Vector{
	constructor(){
		if(!arguments[0]){arguments[0] = 0;}
		if( arguments[0].isVector ){ this.constructFromVector( arguments[0] ); }
		else if( Array.isArray( arguments[0] ) ){ this.constructFromArray( arguments[ 0 ] ); }
		else { this.constructFromArray( arguments ); }
		this.variation = Vector;
	}

	get isVector(){return true;}
	
	constructFromArray( _Array ){
		this.values = new Array( _Array.length ).fill(0).map( ( zero, i )=>{
			if(( typeof _Array[ i ] ) == "number" ){
				return _Array[ i ];
			}
			return 0;
		} );
	}
	
	constructFromVector( _Vector ){
		this.constructFromArray( _Vector.values );
	}
	
	copy(){
		return new Vector( this.values );
	}
	
	/**
		Number of unit vectors
	*/
	get uvLength(){
		return this.values.length;
	}
	
	/**
		@returns Mathematical length of vectors
	*/
	get length(){
		// Length formula, Sqrt( Sum( [...], i->i^2 ) );
		return Math.sqrt( this.dot(
			this
		));
	}
	
	// For ease of access
	get x(){ return this.values[0]; }
	get y(){ return this.values[1]; }
	get z(){ return this.values[2]; }
	get a(){ return this.values[3]; }
	get b(){ return this.values[4]; }
	get c(){ return this.values[5]; }
	
	set x( n ){ this.values[0] = n; }
	set y( n ){ this.values[1] = n; }
	set z( n ){ this.values[2] = n; }
	set a( n ){ this.values[3] = n; }
	set b( n ){ this.values[4] = n; }
	set c( n ){ this.values[5] = n; }
	
	/**
		
	*/
	equals( _Vector ){
		var self = this,
			out = ( this == _Vector );
		if(!_Vector) return false;
		if( self.uvLength == _Vector.uvLength ){
			var match = 0;
			self.values.map( ( x, index )=>{
				match += ( self.values[index] == _Vector.values[ index ] );
			})
			return match == self.uvLength;
		}
		return out;
	}
	
	/**
		Compares unit vectors
	*/
	uvEquals( _Vector ){
		return ( this.uvLength == _Vector.uvLength );
	}
	
	/**
		Dot product of two vectors
	*/
	dot( _Vector ){
		var magA = this.values,
			magB = _Vector.values;
		return Math.sigma( ( i )=>{
			return magA[ i ] * magB[ i ];
		}, this.uvLength);
	}
	
	/**
		Scale a vector by a number
	*/
	scale( _Number ){
		return this.forEach( ( n )=>{ return n * _Number; } );
	}
	
	/**
		Create a vector, n, where n[x] = -this[x]
	*/
	negative(){
		return this.scale( -1 );
	}
	
	/**
		Add two vectors
	*/
	add( _Vector ){
		var values = this.values;
		return _Vector.forEach( ( n, i )=>{ return values[i] + n; } );
	}
	
	/**
		Add two vectors
	*/
	mult( _Vector ){
		var values = this.values;
		return _Vector.forEach( ( n, i )=>{ return values[i] * n; } );
	}

	/**
		Subracts a vector
	*/
	subtract( _Vector ){
		var values = this.values;
		return _Vector.forEach( ( n, i )=>{ return values[i] - n; } );
	}

	forEach( _Function ){
		if( this.isMutable ){
			var self = this;
			self.values.forEach( ( v, i )=>{
				self.values[i] = _Function( v, i );
			});
			return self;
		}else{
			return new this.variation( this.values.map( _Function ));
		}
	}

	map( _Function ){
		return this.forEach( _Function );
	}

	// Multi-operations. Use this when performing multiple operations to reduce the amount of objects being created
	mOpStart(){
		this.isMutable = true;
		return this;
	}

	// Close multi-operations
	mOpStop(){
		this.isMutable = false;
		return this;
	}

	mutate(){
		return this.mOpStart();
	}

	unmutate(){
		return this.mOpStop();
	}

	get string(){
		return this.values.join("_");
	}

	toString(){
		return JSON.stringify(this);
	}

	/**
	 * MUTATES A VECTOR
	 * @param {*} _Vector 
	 */
	assign( _Vector ){
		var self = this;
		return _Vector.forEach( (n, i)=>{
			self.values[i] = n;
		});
	}

}

/* File source: ../lib/javascript/jsbuilder0.0.1/containers/forterate.js */
/**
	A Forterate is a list of self-descriptive entries which represent
	some other object. Usefulness comes to data structures which rely on
	random access of Forterate's elements and easy changing of
	the what the NODE represents
*/
class Forterate{
	/**
		Recycles for efficiency
	*/
	constructor( defaultValue = {}){
		this.entries = [defaultValue]; 		// Contains registered objects
		this.unregisteredValue = {};
		this.evictedIndecies = [];	// Contains unregistered indicies
		this.eiHAshed = {};
		this.nextAvailableIndex = 0;		// 
	}
	
	/**
		Returns stored ledger
	*/
	get contents(){
		return this.entries;
	}

	set default( object ){
		this.entries[0] = object;
	}
	
	/**
		Creates an object meant to be stored within the ledger
		In practical programming, the object would be replaced with
		a pointer
	*/
	createRegisteredObject( index, object ){
		// Status refers to whether or not the object is marked for replacement
		return {index:index,content:object,status:true};
	}
	
	/**
		gets next index without modifying current state
	*/
	previewNextIndex(){
		if( this.hasFreeIndex ){
			return this.evictedIndecies[ evictedIndecies.length-1 ];
		}
		return this.nextAvailableIndex+1;
	}// -> Integer next available index
	
	/**
		Produces a new usable index
		Once changes are made, there is no going back!!
		Unsafe
	*/
	getNextIndex(){
		if( this.hasFreeIndex ){
			var index = this.evictedIndecies.pop();
			delete this.eiHashed[index];
			return index;
		}
		return this.nextAvailableIndex+=1;
	}// -> Integer next available index
	
	/**
		Checks if there is an index marked as null
	*/
	get hasFreeIndex(){
		return ( typeof this.evictedIndecies[0] ) != "undefined";
	}// -> Boolean ( if evictedIndecies has components )
	
	/**
		Registers a new object with the entries
		objects passed through this function are ENSURED registry
		Unless something like a segfault happens
	*/
	registerObject( object ){
		// Registers a new object into the ledger
		var newObjectIndex = this.getNextIndex(),
			ledgerNode = this.createRegisteredObject( newObjectIndex, object );
		
		this.entries[ newObjectIndex ] = ledgerNode;
		
		
		return ledgerNode;
	}// -> Node
	
	/**
		Replaces existing node's content with new content
		
		replacement is volatile if node is inactive
	*/
	changeNodeContent( node, newContent ){
		node.content = newContent;
		return node;
	}// -> Node
	
	/**
		Reassigns existing node with new node
		
		replacement is volatile if node is inactive
	*/
	reasignNode( node, replacement ){
		replacement.index = node.index;
		this.entries[ node.index ]=replacement;
		// original node gets unreferenced
		return replacement;
	}// -> Node
	
	/**
		Labels a registered object to be recycled
	*/
	removeLedgerIndex( index ){
		// Remove an object from the ledger
		// this.entries[index] = null;
		this.evictedIndecies.push( index );
		this.eiHashed[index] = true;
		this.entries[ index ].status = false;
	}
	
	/**
		I forgot this so it might be messy
	*/
	getObject( index ){
		return this.entries[ index ];
	}// -> Node
	
	/**
		A function which allows access to all nodes within the graph
	*/
	iterateAllNodes( callback ){
		// Make sure the node isn't marked as a null index
		var self = this;
		return this.ledger.contents.map( ( ledgerNode, index, ledger )=>{
			// If the index is not unlisted
			if(!self.eiHAshed[index]){
				callback( ledgerNode, index, ledger );
			}
		});
	}// callback ->

	toString(){
		return JSON.stringify(this);
	}
}

/* File source: ../lib/javascript/jsbuilder0.0.1/containers/boplane.js */
/**
	Requires
^ containers/forterate.js	
*/

/**
	A bound plane for storing and accessing members
	
	Allows for cheap member iteration
		and random access of members
*/

/**
	Determine appropriate array type for a set of this length
*/

class BoPlane{
	constructor( rows, cols, contentIdentifier="object" ){
		this.rows = rows;
		this.cols = cols;
		this.map = Math.createSet( rows*cols );
		this.forterator = new Forterate();
		this.contentIdentifier = contentIdentifier;
	}
	
	get width(){ return this.cols }
	get height(){ return this.rows }
	
	get STAT_SUCCESS(){
		return 1;
	}// -> 1
	get STAT_FAIL(){
		return 0;
	}// -> 0
	get STAT_REDIRECT(){
		return 2;
	}// -> 2
	
	
	isInRange( x, y ){
		return x>=0 && x <=this.cols && y>=0 && y<=this.rows;
	}
	
	/**
		forterator nodes are self-descriptive.
	*/
	createNode( x, y, object ){
		var node = {
			x: x,
			y: y}
		node[this.contentIdentifier] = object;
		return node;
	}// -> forterator Node
	
	/**
		Turn random access address to index address
	*/
	coordinateToIndex( x, y ){
		return y * this.rows + x;
	}
	
	/**
		Turn address to coordinates
	*/
	indexToCoordinates( index ){
		return [ Math.floor( index / this.rows ), index % cols ];
	}
	
	/**
		Gets the index of the node stored within the forterator
	*/
	getNodePointer( x, y ){
		var value = this.map[ this.coordinateToIndex( x, y ) ];
		if( !value ){
			// If mapvalue is 0
			return null;
		}
		return value-1;
	}// -> Integer ( forterator index )
	
	/**
		Sets the pointer of a node
	*/
	setNodePointer( x, y, value ){
		var index = this.coordinateToIndex( x, y );
		if( index <= this.map.length ){
			this.map[ index ] = value+1;
		}
		return this.map[index];
	}
	
	/**
		Get a node at this coordinate
	*/
	getNode( x, y ){
		return this.forterator.getObject( this.getNodePointer( x, y ));
	}
	
	/**
		Structured response message
	*/
	createPlacementStatus( statusID, index, object ){
		return {
			statusID: statusID,
			index: index,
			object: object
		}
	}//-> Response Object
	
	replaceObject( x, y, object ){
		var node = this.getNode( x, y );
		node.content[this.contentIdentifier] = object;
		//this.forterator.changeNodeContent( node, this.createNode( x, y, object ) );
		
		return node;
	}
	
	placeNode(  x, y, node ){
		var createdNode = this.forterator.registerObject( node );
		node.index = createdNode.index;
		this.setNodePointer( x, y, node.index );		
		return this.createPlacementStatus( this.STAT_SUCCESS, node.index, node );
	}
	
	/**#################################
	####    USEFUL ABSTRACTIONS     ####
	####################################*/
	
	/**
		Place an object within the world
			replace that object if it already exist
	*/
	placeObject( x, y, object ){
		if( this.getNodePointer( x, y ) ){
			return this.replaceObject( x, y, object );
		}
		this.placeNode( x, y, this.createNode( x, y, object ));
	}
	
	/**
	 * Returns a boplane entry ( an object ) that contains the object
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	getObject( x, y ){
		// If out of bounds
		if( this.isInRange( x, y ) ){
			// If object exists
			var n = this.getNode( x, y );
			if( n ){
				return n.content;
			}else{
				return this.forterator.entries[0];
			}
			
		}else{
			return null;
		}
	}
	
	
	iterateAllNodes( callback ){
		return this.forterator.iterateAllNodes( callback );
	}// callback ->
}

// Tests

function boplaneTEST(){
	// Tests on a 10x10 plane
	var plane = new BoPlane( 10, 10 );
	var results = [
		plane.coordinateToIndex( 0, 0 ),
		plane.coordinateToIndex( 20,10),
		plane.coordinateToIndex( 2,3)
	];
	
	// Test add  nodes
	plane.placeObject( 0, 0, 100 );
	plane.placeObject( 1, 0, 1 );
	plane.placeObject( 2, 2, 22 );
	plane.placeObject( 3, 100, 314 );
	
	return [results, plane ];
}


/*
	Defined
	createSet( Int setSize );
		-> new Number[]
		
	class BoPlane;
		constructor( Int rows, Int cols );
		placeObject( Int x, Int y, Any object );
		getObject( Int x, Int y );
			-> Any
		iterateAllNodes( Func callback );
			-> new Any[]
		createNode( Int x, Int y, Any object );
			-> new Object "BoPlane Node"
		coordinateToIndex( Int x, Int y );
			-> new Integer
		indexToCoordinates( Int index );
			-> new Integer
		getNodePointer( Int x, Int y );
			-> new Integer, Disambiguation: 
		get STAT_SUCESS -> 1;
		get STAT_FAIL -> 0;
		get STAT_REDIRECT -> 2;
*/

if( typeof(module)!="undefined" ){
	module.exports = BoPlane;
}

/* File source: ../lib/javascript/jsbuilder0.0.1/containers/uboplane.js */
/**
	Requires
^ containers/forterate.js

*/
/**
	An unbound plane for storing and accessing members
	allows for cheap member iteration
		and random access of members
*/
class UboPlane{
	constructor(  ){
		this.map = [];					// Contains indicies of registered objects
		this.listOfEntities = new Forterate();
	}
	
	get STAT_SUCCESS(){
		return 1;
	}// -> 1
	get STAT_FAIL(){
		return 0;
	}// -> 0
	get STAT_REDIRECT(){
		return 2;
	}// -> 2
	
	/**
		listOfEntities nodes are self-descriptive.
	*/
	createNode( x, y, object ){
		return {
			x: x,
			y: y,
			object: object
		}
	}// -> listOfEntities Node
	
	/**
		Structured response message
	*/
	createPlacementStatus( statusID, index, object ){
		return {
			statusID: statusID,
			index: index,	// Index within listOfEntities
			object: object	// actual object
		}
	}//-> Response Object
	
	getNodePointer( x, y ){
		if( this.hasSubarray( y )){
			return this.map[ y ][ x ];
		}else{
			return undefined;
		}
	}// -> Integer ( listOfEntities index )
	
	getNode( x, y ){
		return this.listOfEntities.getObject( this.getNodePointer( x, y ));
	}// -> listOfEntities Node
	
	// Runs a method through all nodes on the map
	iterateAllNodes( callback ){
		return this.listOfEntities.iterateAllNodes( callback );
	}// callback ->
	
	/**
		Makes sure there exists an array for the y coordinate
		The first array dimension is Y
		TODO change so it makes more sense.
	*/
	ensureMapAddress( y ){
		if( !this.hasSubarray( y ) ){
			this.map[ y ] = [];
		}
	}
	
	/**
		Checks to see if the row exists
	*/
	hasSubarray( y ){
		return typeof this.map[ y ] != "undefined";
	}// -> Boolean ( First[]Layer is Undefined )
	
	/**
		Creates a node for the object and places it within the map
		> Should be majority of operations
	*/
	placeObject( x, y, object ){
		// If there is something there
		if( this.getNodePointer( x, y ) ){
			
			// Replace it instead
			return this.replaceObject( x, y, object );
		}
		
		// Otherwise place a newly created node
		return this.placeNode( x, y, this.createNode( x, y, object ) );
	}
	
	/**
		Replaces the object of a node with a new node
		> not to be called by implementer
	*/
	replaceObject( x, y, object ){
		// Node which currently occupies spot
		var node = this.getNode( x, y );
		
		// Reassign the node's content
		this.listOfEntities.changeNodeContent( node, object );
		
		return node;
	}
	
	/**
		Places a node within the map
		> Only called to create a node
		* Registers new node if position inst occupied
		* Replaces node if position IS occupied
	*/
	placeNode( x, y, node ){
		/**
		if( getNodePointer( x, y ) ){
			return replaceNode( x, y, node );
		}*/
		
		// Else create a new node
		var createdNode = this.listOfEntities.registerObject( node );
			
		// A little something to help it describe itself
		node.index = createdNode.index;
			
		this.ensureMapAddress( y );
		this.map[ y ][ x ] = node.index;
			
		return this.createPlacementStatus( this.STAT_SUCCESS, node.index, node );
	}// -> Response Object ( placementStatus )

	getObject( x, y ){
		var node = this.getNode( x, y );
		return node ? node.content : null;
	}
	
}

/* File source: ../lib/javascript/jsbuilder0.0.1/containers/basicplane.js */
/**
 * IPlane{
 *      void placeObject( int x, int y, any object );
 *      any getObject( int x, int y );
 * }
 */

class BasicPlane{
    constructor( size, defaultObject={} ){
        // This was causing the weird glitch issues
        // It was filling every row with the refrence to the same column array
        // rather than creating new columns for each row
        this.map = new Array(size).fill(null).map((x)=>{
            return new Array(size).fill(null);
        });
        this.defaultObject = {payload:defaultObject};
        this.rows = size;
        this.cols = size;
    }

    isInRange( x, y ){
		return x>=0 && x <=this.cols && y>=0 && y<=this.rows;
	}

    placeObject( x, y, object ){
        var obj = {payload:object};
        if( this.isInRange( x,y) ){
            this.map[y][x] = obj;
        }   
    }

    /**
     * Returns null if the object is out of range, otherwise it returns the object at x,y or the default object
     * @param {*} x 
     * @param {*} y 
     */
    getObject( x, y ){
        var obj = this.map[y][x];
        if(this.isInRange(x,y)){
            if(!obj){
                return this.defaultObject;
            }
            return obj;
        }else{
            return null;
        }
        
    }

    iterateAllNodes( callback ){
        return this.map.map( ( yArr )=>{
            return yArr.map( callback );
        });
    }
}
// Basicplane and boplane should be used the same way as far as I know

/* File source: ../lib/javascript/jsbuilder0.0.1/containers/propipe.js */
class PropertyPipeline{
	constructor(object) {
		this.object = object;
	}

	set(propertyName, attribute) {
		this.object[propertyName] = attribute;
		return this;
	}

	depthSet(propertyPath, attribute) {
		var destination = this.object;
		for (var i = 0; i < propertyPath.length - 1; i++) {
			destination = destination[propertyPath[i]];
		}
		destination[propertyPath[propertyPath.length - 1]] = attribute;
		return this;
	}

	get(propertyName) {
		return this.object[propertyName];
	}

	// Close returns the object
	close() {
		return this.object;
	}

	// save returns the propipe instance
	save() {
		return this;
	}
}

/* File source: ../lib/javascript/jsbuilder0.0.1/objects/CRContext2DProxy.js */
/**
	Canvas context, but in a pipeline structure.
	Minimize work as much as possible.
	;)

	Reasons for canctxplus:
	
		* Rotation is too confusing.
		* Setting stuff is lame
		* Looks messy
		* Raw context lacks a lot of things
	
	canctxplus operation flow:
	
	
	// Like this
		canctxplus.methodA( param, param, param)
			.methodB( param, param, param )
			.methodC( param )
			.default();
		
	// Not like this
		canvas.prop = "";
		canvas.methodA( param, param, param, param, param );
		canvas.methodB( param, param, param );
		canvas.methodC( param, param );
		// more methods that return canvas to default state
		canvas.defaultA( 0, 0, 0 );
		canvas.defaultB( 0 );
			...
*/


// Turn a regular canvas context into a plus context
CanvasRenderingContext2D.prototype.expand = function(){
	var self = this;
	return new CRContext2DProxy( this );
}

CanvasRenderingContext2D.prototype.makeBetter = CanvasRenderingContext2D.prototype.expand;

class CRContext2DProxy{
	constructor( context ){
		
		var self = this,
			descriptor ={};
			
		self.context = context;
		self.transformations = [];
		
		if(!context){
			console.warn("No parent context assigned to new instance of CRContext2DProxy!\nUsage requires a linked context, use CRContext2DProxy.parentContext = CanvasRenderingContext2D");
		}
		
		// Debating whether to do this outside where it modifies the prototype
		// Or inside where pipeline methods are created during construction
		
		// Creates pipeline proxy
		Object.keys( CanvasRenderingContext2D.prototype ).map( ( proto )=>{
			descriptor = Object.getOwnPropertyDescriptor(
					CanvasRenderingContext2D.prototype, proto
			);
			
			// If the operation hasn't already been predefined
			if( self.__proto__[proto] ){
				return;
			}
			
			// Convert it to a pipeline method.
			if( descriptor.set ){
				self[`set${ proto.capitalize() }`] = function( param ){
					self.context[ proto ] = param;
					return self;
				}
				self[`get${ proto.capitalize() }`] = function( param ){
					return self.context[ proto ];
				}
			}else{
				self[ proto ] = function( parameters ){
					if( typeof parameters == "undefined" ){
						parameters = [];
					}
					self.context[ proto ](...parameters);
					return self;
				}
			}
		})
	}
	
	/**
		PROPERTIES
	*/
	
	setImageSmoothingEnabled( bool ){
		this.context.imageSmoothingEnabled = bool;
		this.context.mozImageSmoothingEnabled = bool;
		this.context.webkitImageSmoothingEnabled = bool;
		this.context.msImageSmoothingEnabled = bool;
		return this;
	}
	
	// Linecap
	
	get globalCompositeOperations(){
		return [
			"source-in",
			"source-out",
			"source-atop",
			"destination-over",
			"destination-in",
			"destination-out",
			"destination-atop",
			"lighter",
			"copy",
			"xor",
			"multiply",
			"screen",
			"overlay",
			"darken",
			"lighten",
			"color-dodge",
			"color-burn",
			"hard-light",
			"soft-light",
			"difference",
			"exclusion",
			"hue",
			"saturation",
			"color",
			"luminosity"
		];
	}
	
	/**
	Because im lazy
	Usage:
	
		ContextPlusInstance.methodStep( "beginPath" )
			.methodStep( "arc", [....] )
			.propStep( "fillStyle", "orange" )
			.methodStep( "fill" );
	*/
	methodStep( methodName, parameters ){
		this.context[methodName](...parameters);
		return this;
	}
	
	/**
	Because im lazy
	Usage:
		cPlus.propStep( "fillStyle", "#fff" )
			.propStep( "globalAlpha", 0 );
	*/
	propStep( propertyName, value ){
		this.context[propertyName] = value;
		return this;
	}
	
	set parentContext( ctx ){
		this.context = ctx;
	}
	
	get parentContext(){
		return this.context;
	}
	
	// Create methods have default return value
}

/* File source: ../lib/javascript/jsbuilder0.0.1/objects/Color.js */
class Color{
    constructor(red, green, blue, alpha, colorModifier ){
        
        colorModifier = colorModifier ? colorModifier : ( x )=>{ return x }
        
        this.red = parseInt( colorModifier( red || 0 ) );
        this.green = parseInt( colorModifier( green || 0 ) );
        this.blue = parseInt( colorModifier( blue || 0 ) );
        this.alpha = typeof alpha != "undefined" ? alpha : 1;
    }
    
    // Returns formatted color string
	get rgbaString() {
		var self = this,
			order = ["red", "green", "blue", "alpha"];

		// BEAUTIFUL barfscript
		var innards = order
			.map(key => {
				return self[key];
			})
			.join(", ");

		return `rgba(${innards})`;
	}

	// Returns formatted color string
	get rgbString() {
		var self = this,
			order = ["red", "green", "blue"];

		// BEAUTIFUL barfscript
		var innards = order
			.map(key => {
				return self[key];
			})
			.join(", ");

		return `rgb(${innards})`;
	}
}

/* File source: ../lib/javascript/jsbuilder0.0.1/utils/simpleee.js */
/**
 * SimpleEE is just a re-invented wheel that can be used if this game is ported to the web
 */
class SimpleEventEmitter{
    constructor( maxEventHistoryLength=0 ){
        this.events = {};
        this.onceEvents = {};
        this.eventHistory = [];
        this.eventHistoryMaxSize = maxEventHistoryLength;
    }

    ensureEventIsDefined( eventName ){
        if( !this.events[eventName]){
            this.events[eventName] = [];
            this.onceEvents[eventName] = [];
        }
    }
    
    on( eventName, handler ){
        this.ensureEventIsDefined( eventName );
        this.events[eventName].push( handler );
    }

    once( eventName, handler ){
        this.ensureEventIsDefined( eventName );
        this.onceEvents[eventName].push( handler );
    }

    emit( eventName, thisArg, ...params ){
        this.ensureEventIsDefined( eventName );
        this.events[eventName].map( (handler)=>{
            handler.apply( thisArg, params );
        });
        while(this.onceEvents[eventName].length > 0){
            let callback = this.onceEvents[eventName].pop();
            callback.apply( thisArg, params );
        }
        if(this.maxEventHistoryLength<=0) return;
        this.eventHistory[this.eventHistory.length%this.eventHistoryMaxSize] = {date:new Date().getTime(), eventName:eventName, params:params}
    }
}

