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
	return self[0].toUpperCase()+self.substring(1);
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
		if( Object.getClassName( arguments[0] ) == "Vector" ){ this.constructFromVector( arguments[0] ); }
		else if( Array.isArray( arguments[0] ) ){ this.constructFromArray( arguments[ 0 ] ); }
		else { this.constructFromArray( arguments ); }
		this.variation = Vector;
	}
	
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
			return replaceObject( x, y, object );
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
		var node = getNode( x, y );
		
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

if( typeof StringUtils == "undefined" ){
	String.prototype.capitalize = function(){
		return this[0].toUpperCase()+this.substring(1);
	}
}

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
        this.eventHistory = [];
        this.eventHistoryMaxSize = maxEventHistoryLength;
    }

    ensureEventIsDefined( eventName ){
        if( !this.events[eventName]){
            this.events[eventName] = [];
        }
    }
    
    on( eventName, handler ){
        this.ensureEventIsDefined( eventName );
        this.events[eventName].push( handler );
    }

    emit( eventName, thisArg, ...params ){
        this.ensureEventIsDefined( eventName );
        this.events[eventName].map( (handler)=>{
            handler.apply( thisArg, params );
        });
        if(this.maxEventHistoryLength<=0) return;
        this.eventHistory[this.eventHistory.length%this.eventHistoryMaxSize] = {date:new Date().getTime(), eventName:eventName, params:params}
    }
}

/* File source: ../src/Ambitious_Dwarf///src/engine/containers/vectorvariations.js */
class CoordinateVector extends Vector{
    constructor( ...args ){
        super(...args);
        this.variation = CoordinateVector;
    }
}

class PlanarRangeVector extends Vector{
	constructor(...args){
        super(...args);
        this.variation = PlanarRangeVector;
	}

	includes( v ){
		return Math.isInRange( v.x, this.x, this.x+this.z ) && Math.isInRange( v.y, this.y, this.y+this.a );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/initmethods.js */
/**
 * This section is for global access
 */
Townsend = {
	instance:{},
	analytics:{},
	locked:{}, // Stuff that i thought would work, but doesn't
	batch:{
		count:0,
		overflowOffset: new Vector(1,0)
	},
	tiles:{},
	sprites:{},
	neighborOffsetVectors:{
		north: new Vector( 0, -1 ),
		east: new Vector( 1,0 ),
		south: new Vector( 0, 1 ),
		west: new Vector( -1, 0)
	},
	neighborDiagonalOffsetVectors:{
		northWest: new Vector( -1, -1 ),
		northEast: new Vector( 1, -1),
		southEast: new Vector( 1, 1),
		southWest: new Vector( -1, 1)
	},
	placeholders:{
		empty2dVector: new Vector( 0,0 ),
		chunkExtendVector: new PlanarRangeVector( 0, 0, 1, 1 )
	},
	eventEmitter: new SimpleEventEmitter(100)
};

// Translate labled neighbors to iterable array
Townsend.neighborOffsetVectorList = Object.values( Townsend.neighborOffsetVectors );
Townsend.neighborDiagonalOffsetVectorList = Object.values( Townsend.neighborDiagonalOffsetVectors );
Townsend.neighborMergedOffsetVectorList = Object.values( Townsend.neighborOffsetVectors );
Townsend.neighborMergedOffsetVectorList.push( ...Object.values( Townsend.neighborDiagonalOffsetVectors ) );

/**
 * This section is for native window
 */
if( nw ){
	Townsend.Window = nw.Window.get();
	Townsend.Window.maximize();
}

/**
 * This section is for making sure all sprite atalases are loaded
 */
Townsend.tilesheetsReady = 0;
Townsend.allTilesheetsLoaded = false;
var tilesheetReadyCheck = function(){
	Townsend.tilesheetsReady++;
	Townsend.allTilesheetsLoaded = Object.keys(Townsend.spriteSheets).length == Townsend.tilesheetsReady;
	if( Townsend.tilesheetsReady ){
		console.log("All spritesheets loaded and ready to go!");
	}
}


var initMethods = [];

function start(){
	console.log("starting");
	initMethods.map( function(f){
		f();
	});
}

/* File source: ../src/Ambitious_Dwarf///src/localization/localization.js */
class Localizer{
	constructor(){}
	combine( strings ){
		return strings.join(" ");
	}
}

/* File source: ../src/Ambitious_Dwarf///src/localization/en_us.js */
let STR = new Localizer();

STR.debug = "Debug Debug Debug";

STR.class = {
	Canvas2DContextPlus:"Canvas2DContextPlus",
	Vector: "Vector"
}

STR.error = {
	NF:"not found",
}

STR.htmlTag = {
	IMG:"img",
	CANVAS:"canvas"
}

STR.ID = {
	rendering: "rendering",
	prerendering: "prerendering",
	contextType: "2d"
}

STR.tile = {
	tile:"blank"
}

/* File source: ../src/Ambitious_Dwarf///src/config.js */
var cfg = {};

cfg.memory_max = 4000;

cfg.mouse_interaction_canvas = "top";   // Required, changing will not change anything

// Debug stuff
cfg.debug_enable = true; // Enable debugging stuff ( console out, debug window, etc )
cfg.debug_window_FontSize = "12px"; // Pixels
cfg.debug_window_Width = 400;
cfg.debug_defaultInterval = 100;
cfg.debug_mp_enable = true;
cfg.debug_mp_interval = 100; // ms
cfg.debug_fps_enable = true;
cfg.debug_fps_interval = 1000/30;
cfg.debug_heapUsed_enable = false;
cfg.debug_heapUsed_interval = 100;
cfg.debug_analytics_flow_enable = false;
cfg.debug_analytics_flow_interval = 16;
cfg.debug_pixeloffset_enable = true;
cfg.debug_pixeloffset_interval = 16;
cfg.debug_general_analytics_enable = true;
cfg.debug_general_analytics_interval = 16;
cfg.debug_chunk_draw = false;
cfg.debug_chunk_backgroundload_disable = true;
// World stuff
cfg.world_chunkSize = 32; // The size of each chunk, in tiles
cfg.world_treePlacementModifier = 0.05; // The chance that a tree will be placed
cfg.world_map_size_debug = 2;
cfg.world_map_size_normal = 5;
cfg.world_map_size_double = 10;
cfg.world_map_size_large = 20;
cfg.world_time_draw_enable = false;
cfg.tile_size = 16;
// Sprite Batches
cfg.batching_enable = false; // Don't enable. EVER.

cfg.entity_roam_length = 10;

// Sprite stuff
cfg.sprite_ground_y = 4;
cfg.sprite_ground_flowSizeCoefficent = 4;
cfg.sprite_ground_flowFrameCoefficent = 1/10/4;

// Pathfinding
cfg.pathfinding_cost_vh = 1;    // Vertical-horizontal (vh)
cfg.pathfinding_cost_diagonal = Math.sqrt(2);
cfg.pathfinding_iteration_max = 50000;
cfg.pathfinding_batch_size = 10;

// Map move constants
cfg.map_move_rate_cc = 0;
cfg.map_move_rate_px = 1;
cfg.map_move_rate_nx = -1;
cfg.map_move_rate_py = 1;
cfg.map_move_rate_ny = -1;

cfg.update_tps_pause = 0;
cfg.update_tps_normal = 20;
cfg.update_tps_double = 40;
cfg.update_tps_triple = 60;

cfg.update_interval_pause = 0;
cfg.update_interval_normal = 1000/cfg.update_tps_normal;
cfg.update_interval_double = 1000/cfg.update_interval_double;
cfg.update_interval_triple = 1000/cfg.update_interval_triple;

/* File source: ../src/Ambitious_Dwarf///src/engine/dev/debugs.js */
var stdExecLimit = 100;

var ExecLims = {
    log:{
        tileCreate: new ExecutionLimiter( stdExecLimit, console.log ),
        batchTileCoord: new ExecutionLimiter( 200, console.log )
    }
};

class DebugWindow{
    constructor( width ){

        this.element = document.createElement("div");
        this.width = width;
        var element = this.element;
        this.stylizeElement(element);
        this.watchers = {};
        this.configurators = {};
        this.collapsibles = {};

        if(!cfg.debug_enable){
            console.warn(`"Debug is not enabled!" cfg.debug_enabled`);
            return;
        }
        
        this.appendWindowToBody( element );
    }

    appendWindowToBody( element ){
        document.body.appendChild( element );
    }

    stylizeElement( element ){
        element.style.zIndex = 1000;
        element.style.width = this.width;
        element.style.position = "absolute";
        element.style.top = "0px";
        element.style.right = "0px";
        element.style.color = "white";
        element.style.wordWrap="break-word";
        element.style.fontSize=cfg.debug_window_FontSize;
        element.style.padding=3;
        element.style.backgroundColor = new Color(10, 15, 25, 0.5).rgbaString;
    }

    addCollapsable( id, contents ){

    }

    // Creates a section with a form for changing values
    addConfigurator( desc, on_submit ){
        
    }

    addWatcher( value, identity, fmt=JSON.stringify ){
        if(!cfg[`debug_${identity}_enable`]){
            console.warn(`"Watcher for [ ${identity} ] not enabled in config!" cfg.debug_${identity}_enabled`);
            return;
        }

        var self = this,
            watcher = {
                element: document.createElement("div")
            },
            element = watcher.element;
            
        self.watchers.interval = setInterval( ()=>{
            element.innerHTML = identity+": "+fmt( value );
        }, `cfg.debug_${identity}_interval` || cfg.debug_defaultInterval );

        self.element.appendChild( element );
        self.watchers[ identity ] = watcher;
    }
}

/* File source: ../src/Ambitious_Dwarf///src/engine/render/rendering.js */
var global = this;

class RenderingManager{
	/**
	 * RenderingManager holds canvases
	 * @param {String[]} canvasIdentifierList a string-list of canvas identifiers
	 */
	constructor(canvasIdentifierList) {
		var self = this;

		// If no canvas list is given, default to [ rendering, prerendering ]
		canvasIdentifierList = canvasIdentifierList ? canvasIdentifierList : [STR.ID.rendering, STR.ID.prerendering];

		new PropertyPipeline(self)
			.set("canvases", {})
			.set("contexts", {})
			.set("allocationIndecies",{})
			.set("drawRoutines", {})
			.set("canvasPipelines", {})
			.set("renderProxy", {});
		
		if( !CRContext2DProxy ){ throw STR.combine( [ STR.class.CRContext2DProxy, STR.error.NF ] ); }
		
		// Setup canvases
		canvasIdentifierList.map( ( canvasIdentifier, i, arr )=>{
			var canvas = document.createElement( STR.htmlTag.CANVAS ),
				context = canvas.getContext( STR.ID.contextType );
			
			self.canvases[canvasIdentifier] = canvas;
			self.contexts[canvasIdentifier] = context;
			self.canvasPipelines[canvasIdentifier] = new CRContext2DProxy(context);

			canvas.style.zIndex = (arr-i)*100;

			Townsend.Window.on("resize", ()=>{
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;		
				context.imageSmoothingEnabled = false;		
			})

			// Assign-before-append
			document.body.appendChild(
				new PropertyPipeline(canvas)
					.set("className", canvasIdentifier)
					.set("id",canvasIdentifier)
					.set("width", window.innerWidth)
					.set("height", window.innerHeight)
					.set("imageSmoothingEnabled", false)
					.set("hide", function(){ this.style.visibility="hidden" })
					.close()
			);

			self.allocationIndecies[ canvasIdentifier ] = 0;
			
			// Create a new routineCollection for this canvas
			self.drawRoutines[canvasIdentifier ] = new RoutineCollection();
			context.imageSmoothingEnabled = false;
		});
		
		// CRContext2DProxy
		self.proxy = canvasIdentifierList[0];

		// The default canvas is the canvas assigned to the first identifier
		self.canvases.default = self.canvases[ canvasIdentifierList[ 0 ] ];

		if(self.canvases.prerendering){
			self.canvases.prerendering.hide;
		}
	}

	requestCanvasAllocation( canvasIdentifier, pixelWidth ){
		var availableIndex = this.allocationIndecies[ canvasIdentifier ];
		this.allocationIndecies[ canvasIdentifier ] +=pixelWidth;
		return availableIndex;
	}

	/**
	 * Assign a new drawroutine to a destination canvas
	 * @param {String} canvasIdentifier a canvas identifier
	 * @param {Routine} routine the drawroutine that will be assigned
	 */
	addRoutine( canvasIdentifier, routine ){
		var self = this;
		self.drawRoutines[ canvasIdentifier ].addRoutine( routine );
	}

	/**
	 * Call all drawroutines of a canvas
	 * @param {String} canvasIdentifier a canvas identifier
	 */
	render(canvasIdentifier ){
		var self = this;
		self.drawRoutines[canvasIdentifier ].call();
	}



	// Omit
	set proxy(canvasIdentifier ){
		var context = this.contexts[canvasIdentifier ];
		if( context ){
			this.renderProxy = new CRContext2DProxy(this.contexts[canvasIdentifier ] );
		}
	}
	
	get proxy(){
		return this.renderProxy;
	}
}

/* File source: ../src/Ambitious_Dwarf///src/engine/containers/spritesources.js */
class TileLocation{
	constructor( _Vector$start, _Vector$size ){
		this.start = _Vector$start;
		this.size = _Vector$size ? _Vector$size : new Vector( 1, 1 );
	}
}

var createSource = {
	img: function( srcPath, events ){
		var img = document.createElement( STR.htmlTag.IMG );
		events = events? events:{};
		Object.keys( events ).map( (key)=>{
			img[ key ] = events[key];
		} );
		img.src = srcPath;
		return img;
	}
};

class TileManager{
	constructor(){
		this.tilesheets = [];
	}
	
	addTilesheet( _TileSheet ){
		_TileSheet.managerindex = this.tilesheets.length;
		this.tilesheets.push( _TileSheet );
	}
	
	getTileByIDString( idString ){
		
	}
	
	getTileIDString( _TileSheet ){
		
	}
}

/* File source: ../src/Ambitious_Dwarf///src/engine/containers/tilesheet.js */
class Tilesheet{
	constructor( _Source, unitSize, onload ){
		this.source = _Source;
		onload = onload ? onload : ()=>{};
		_Source.onload = onload;
		this.tileLocations = {};		// Locations which tiles are stored within the tile sheet
		this.unitSize = unitSize || 1; // Tile unit size in pixels
		this.managerindex = 0;
	}
	
	// Add tile, but also scale it by unit size
	addTile( identifier, _TileLocation ){
		var uSize = this.unitSize;
		_TileLocation.size = new Vector( _TileLocation.x*uSize,_TileLocation.y*uSize );
		this.tileLocations[ identifier ] = _TileLocation;
	}
	
	getTile( identifier ){
		return this.tileLocations[identifier];
	}
	
	getTileAt( row, col ){
		var self = this;
		return new Vector( col * self.unitSize, row*self.unitSize );
	}
	
	drawTile( _HTMLCanvasContext, _Vector$start, _Vector$dest, width, height ){
		this.drawPartialTile( _HTMLCanvasContext, _Vector$start, this.unitSize, this.unitSize, _Vector$dest, width, height );
	}

	drawPartialTile( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height ){
		_HTMLCanvasContext.drawImage( this.source,
			_Vector$start.x, _Vector$start.y,
			unitSizeW, unitSizeH,
			_Vector$dest.x, _Vector$dest.y,
			width, height
		);
	}

	/**
	 * If a spritesheet's sprites are within a single strip
	 * @param {*} _HTMLCanvasContext 
	 * @param {*} index 
	 * @param {*} sourceWidth 
	 * @param {*} sourceHeight 
	 * @param {*} width 
	 * @param {*} height 
	 */
	drawIndexed( _HTMLCanvasContext, index, sourceWidth, sourceHeight, width, height ){
		_HTMLCanvasContext.drawImage( this.source,
			index, 0,
			sourceWidth, sourceHeight,
			_Vector$dest.x, _Vector$dest.y,
			width, height
		);
	}
}

/* File source: ../src/Ambitious_Dwarf///src/engine/containers/spritesheet.js */
/**
 * Distinction between spritesheet and tilesheet? tilesheet should have been called something else.
 */
class Spritesheet extends Tilesheet{
	constructor( _Source, unitSize, onload ){
		super( _Source, unitSize, onload );
	}

	getSpriteAt( ...args ){
		return this.getTileAt( ...args );
	}

	drawPartialSprite( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height ){
		this.drawPartialTile( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/render/DF/spritedefs.js */
var TS = {
	placeholders: new Spritesheet( createSource.img( "src/assets/placeholder-atlas.png" ), 16, tilesheetReadyCheck ),
	DFDefault: new Spritesheet( createSource.img( "src/assets/DF/03.png" ), 16, tilesheetReadyCheck ),
	grass: new Spritesheet( createSource.img( "src/assets/grassCycle.png" ), 16, tilesheetReadyCheck ),
	plants1: new Spritesheet( createSource.img( "src/assets/bush1.png" ), 16, tilesheetReadyCheck ),
	people1: new Spritesheet( createSource.img( "src/assets/people1.png" ), 4, tilesheetReadyCheck ),
	DFEntities: new Spritesheet( createSource.img( "src/assets/DF/07.png" ), 16, tilesheetReadyCheck ),
	drone: new Spritesheet( createSource.img( "src/assets/drone.png" ), 16, tilesheetReadyCheck )
}

Townsend.spriteSheets = TS;

/* File source: ../src/Ambitious_Dwarf///src/game/render/viewcontext.js */
/**
 * Has data that will be used in rendering the map
 * pixelOffset - the offset of the mapview from 0,0
 * frameCounter - the total amount of frames drawn
 * scale - the scale of the tiles
 * tileSize - the size of a tile
 * scaleCoefficent - this times tileSize gives the size of a tile to be rendered
 * tileScaleSize - basically whats up there ^ but cached
 */

/**
 * ViewComponent defines the area which the game will be displayed
 */
class ViewContext { // Will eventually be split into TileViewContext and ViewContext
	/**
	 * View Component
	 */
	constructor() {
		var self = this;

		self.propipe = new PropertyPipeline(self)
			.set("cache", { package: {} })
			.set("children", {})
			.set("frameCounter", 0)
			.save();
	}

	// Was working on VCCAssign -->

	/**
	 * Cache packets of refrences
	 * Also for contexts to have easy access to other contexts
	 * @param {String} cacheIdentifier
	 * @param {Object[]} properties
	 */
	createCachePackage(cacheIdentifier, properties) {
		this.cache.package[cacheIdentifier] = properties;
	}

	/**
	 * Get a cached package
	 * @param {String} cacheIdentifier
	 */
	getCachePackage(cacheIdentifier) {
		return this.cache.package[cacheIdentifier];
	}

	/**
	 * Assign a context, must have certain methods to identify as a VCCompatableContext
	 * 
	 * Adding contexts links them all together, with respect to the parent
	 * This allows easy access to readily needed states while maintaining structure
	 * @param {any} context
	 */
	assignContext(contextInstance) {
		// If the contextInstance is a VCCompatibleContext
		if (VCContextCompatableInterface.confirm(contextInstance.__proto__)) {
			contextInstance.VCCAssign(this);
		}
	}
}

// Create a snapshot of object attributes access differences
// Best use for primitives
class AttributeSnapshot{
	constructor( object, attributesArray_String ){
		var self = this;
		self.object = object;
		self.snapshots = {};
		self.createSnap();
	}

	// Returns weather the attributes has changed from the snapshot
	compare(){
		var diff = 0,
			self = this;
		attributesArray_String.map( ( attr )=>{
			diff+= self.snapshots[attr] == self.object[attr] ? 0 : 1;
		});
		return diff <= 0;
	}

	createSnap(){
		var self = this;
		attributesArray_String.map( ( attr )=>{
			self.snapshots[attr] = self.object[attr];
		});
	}
}



/**
 * Uses of drawData:
 * engine/control/mouse.js
 * game/render/camera.js
 * game/render/routines/mouseupdate.js
 * game/render/routines/tiledraw.js
 * 
 * Uses of renederManager
 * game/render/camera.js
 * game/render/routines/mouseupdate.js
 *  game/render/routines/tiledraw.js
 */

/* File source: ../src/Ambitious_Dwarf///src/game/render/tilescalehelper.js */
class TileScaleHelper {
	constructor( _TiledViewContext ) {
		this.propipe = new PropertyPipeline( this );

		this.propipe
			.set("viewContext", _TiledViewContext)
			.set("tileSize", cfg.tile_size)
			.set("defaultTileSize", cfg.tile_size)
			.set("lastTileSize", cfg.tile_size)
			.set("cursorCorrection", this.newCursorCorrection) 
			.set("defaultChunkSize", cfg.world_chunkSize * cfg.tile_size )
			.set("chunkSize", cfg.world_chunkSize * cfg.tile_size)
			.set("lastChunkSize", cfg.world_chunkSize* cfg.tile_size)
			.set("lastTileScale", 0)
			.set("tileDeltaSign", 1)
			.set("tileScale", 0)
			.set("coefficent", 1);
	}
	
	get newCursorCorrection(){
		return new Vector(0,0);
		//return new Vector(0,self.tileSize/2);
	}

	/**
	 * Set the scale and update some properties
	 * This does weird things..
	 * @param {Number} n 
	 */
    set scale(n){
		var self = this;
		self.propipe
			.set("lastTileSize", self.tileSize)
			.set("lastChunkSize",cfg.world_chunkSize * self.tileSize)
            .set("lastTileScale", self.tileScale)
            .set("tileScale", n)
            .set("coefficent", Math.pow( Math.E, n ))
			.set("tileSize", self.defaultTileSize * self.coefficent)
			.set("chunkSize", cfg.world_chunkSize * self.tileSize)
            .set("tileDelta", self.lastTileSize - self.tileSize )
            .set("cursorCorrection", self.newCursorCorrection)
			.save();
		
		this.adjustPixelOffset();
	}

	adjustPixelOffset(){
		Townsend.viewContext.pixelOffset.x-=window.innerWidth/2;
		Townsend.viewContext.pixelOffset.y-=window.innerHeight/2;
		Townsend.viewContext.pixelOffset.x*=this.tileSize/this.lastTileSize;
		Townsend.viewContext.pixelOffset.y*=this.tileSize/this.lastTileSize;
		Townsend.viewContext.pixelOffset.x+=window.innerWidth/2;
		Townsend.viewContext.pixelOffset.y+=window.innerHeight/2;
	}

	get scale(){
		return this.tileScale;
	}
	
	/**
	 * Set the scale and update some properties
	 * @param {Number} n 
	 */
	setScale( n ){
		this.scale = n;
	}

	/**
	 * Evaluate the displayed tile size
	 * @param {Integer} sideLength in pixels
	 */
	evaluateTileSize( sideLength ){
		return sideLength * this.coefficent;
	}

	static getViewRange( _ViewContext ){
		var scaleHelper = _ViewContext.tileScaleHelper;
		var viewedTileSize = scaleHelper.tileSize;
		var xSize = window.innerWidth/viewedTileSize;
		var ySize = window.innerHeight/viewedTileSize;
		return new PlanarRangeVector(
			Math.floor(- _ViewContext.pixelOffset.x / viewedTileSize)-1, 
			Math.floor(- _ViewContext.pixelOffset.y / viewedTileSize)-1,
			Math.floor(xSize+2), Math.floor(ySize+2)
		);
	}

	static getChunksInViewRange(){
		var viewContext = Townsend.viewContext;
		var scaleHelper = viewContext.tileScaleHelper;
		var viewedChunkSize = scaleHelper.chunkSize;
		var xSize = window.innerWidth/viewedChunkSize;
		var ySize = window.innerHeight/viewedChunkSize;
		return new PlanarRangeVector(
			Math.floor(- viewContext.pixelOffset.x / viewedChunkSize)-1, 
			Math.floor(- viewContext.pixelOffset.y / viewedChunkSize)-1,
			Math.floor(xSize)+3, Math.floor(ySize)+3
		);
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/render/tileviewcontext.js */
class TileViewContext extends ViewContext{
	constructor(){
		super();
		var self = this;
		self.propipe = new PropertyPipeline(self)
			.set("renderingManager", new RenderingManager([
				"rendering",        //
				"lightsOverflow",
				"ambientLight",
				"overflow",  // Rendering parts that go above the entity
				"lights",
				"entities",         // The entity
				"cursor",           // The cursor
				"ground",           // The ground soon depreciated
			]))
			.set("frameCounter", 0)
			.set("needsRedraw", false)
			.set("frameCounterLast", 0)
			.set("frameTimeLast",new Date().getTime())
			.set("visualUpdateInterval", 15)
			.set("pixelOffset", new Vector(window.innerWidth/2, window.innerHeight/2))
			.set("tileSize", cfg.tile_size)
			.set("tileScaleHelper", new TileScaleHelper( self ))
			.set("drawRoutines", {})
			.set( "cursor", new TiledCursorInteractionContext( self  ) )
			.set("animations", {
				zoom:{ timeStart:0, goal:0 }
			})
			.save();

	}

	get canvas(){
		return this.renderingManager.canvases.default;
	}

	initDrawRoutines(){
		var self = this;
		self.drawRoutines.viewRangeUpdate = new Routine(
			TileViewContext.t3_viewRangeUpdate,
			null, null, 
			()=>{ return TileViewContext.t3_viewRangeUpdate( self ); }
		);
		self.drawRoutines.chunk = new Routine(
			TileViewContext.t3_chunkDrawRoutine,
			null, null, 
			()=>{ return TileViewContext.t3_chunkDrawRoutine( self ); }
		);
		self.drawRoutines.entity = new Routine(
			TileViewContext.t3_entityDrawRoutine,
			null, null, 
			()=>{ return TileViewContext.t3_entityDrawRoutine( self ); }
		);

		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.viewRangeUpdate);
		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.chunk);
		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.entity);
	}
	
	/**
	 * 
	 * @param {HTMLCanvasContext2d} context 
	 */
	static clearViewspace( context ){
		context.clearRect(0,0,window.innerWidth,window.innerHeight);
	}

	static t3_viewRangeUpdate(){
		TileViewContext.clearViewspace( Townsend.CVSCTX.rendering );
		Townsend.viewContext.chunkViewRange = TileScaleHelper.getChunksInViewRange( Townsend.viewContext );
	}

	static t3_chunkDrawRoutine(  ){
		TileViewContext.clearViewspace( Townsend.CVSCTX.ground );
		TileViewContext.clearViewspace( Townsend.CVSCTX.overflow );

		var chunkRange = Townsend.viewContext.chunkViewRange,
			chunk = null;

		nestedIncriment([0,0], [chunkRange.z, chunkRange.a], (x, y) => {
			var relX = x + chunkRange.x,
				relY = y + chunkRange.y;
			chunk = Townsend.World.getChunk( relX, relY );
			if( chunk ){
				chunk.renderer.t3_drawProtocol();
				Townsend.viewContext.t3_renderChunk( chunk, relX, relY );
			}
		});

		if(cfg.debug_chunk_backgroundload_disable){ return; }
		if(Townsend.World.chunkNeedsPrerender.length==0){return;}
		chunk = Townsend.World.chunkNeedsPrerender.pop();
		if(!chunk.renderer.firstRenderDone){
			chunk.renderer.t3_drawProtocol();
		}

	}

	/**
	 * Drawroutine for entities
	 */
	static t3_entityDrawRoutine(){
		TileViewContext.clearViewspace( Townsend.CVSCTX.entities );

		var chunkRange = Townsend.viewContext.chunkViewRange.add( Townsend.placeholders.chunkExtendVector );
		/*
			Checks if entity is within view range (chunk-wise), renders if so.
		*/
		Townsend.World.entities.map( ( entity )=>{
			if(chunkRange.includes( entity.chunk.position )){
				Townsend.viewContext.t3_renderEntity( entity );
			}
		});
	}

	/**
	 * 
	 * @param {Chunk} chunk 
	 * @param {Number} relX Relative X coordinate
	 * @param {Number} relY Relative Y coordinate
	 */
	t3_renderChunk( chunk, relX, relY ){
		// Where the chunk is presented on screen
		var screenX = relX * Townsend.VCTSH.chunkSize + Townsend.viewContext.pixelOffset.x;
		var screenY = relY * Townsend.VCTSH.chunkSize + Townsend.viewContext.pixelOffset.y;
		Townsend.CVSCTX.ground.drawImage( chunk.renderer.canvas, screenX, screenY, Townsend.VCTSH.chunkSize, Townsend.VCTSH.chunkSize );
		Townsend.CVSCTX.overflow.drawImage( chunk.renderer.canvasOverflow, screenX, screenY-Townsend.VCTSH.tileSize, Townsend.VCTSH.chunkSize, Townsend.VCTSH.chunkSize );
		if( cfg.debug_chunk_draw ) this.debugRenderChunkRegion( chunk, screenX, screenY );
	}

	debugRenderChunkRegion( chunk, screenX, screenY ){
		var ctx = Townsend.CVSCTX.rendering;
		ctx.fillStyle = chunk.renderer.debug_color;
		ctx.fillRect( screenX, screenY, Townsend.VCTSH.chunkSize, Townsend.VCTSH.chunkSize );
		ctx.font = `${Townsend.VCTSH}px`;
		ctx.fillStyle = "white";
		ctx.fillText( JSON.stringify(chunk.position.values), screenX, screenY+20 );
	}

	t3_renderEntity( entity ){
		// Entity already has a method to describe it's absolute pixel position
		// So there's no need for extra data when it comes to rendering the entity
		// Simply globalPixelPosition + viewContext.pixelOffset
		entity.sprite.t3_drawRoutine();
	}

	draw(){
		TileViewContext.draw( this );
	}

	static DEPRECIATED_drawRoutineData_tile( self ){
		return {
			ctx: self.renderingManager.contexts.rendering,
			ctxPipeline: self.renderingManager.canvasPipelines.rendering,
			TS: TS, // defined in game/render/spritedefs.js
			viewContext: self,
			world: world, // Defined in game/map/init.js
			mouse: self.cursor
		};
	}

	static draw( self ){
		TileViewContext.updateFPS( self );
		//self.renderingManager.contexts.rendering.globalAlpha = 1;
		//TileViewContext.clearRenderspaces( self, ["overflow","ground"] );
		TileViewContext.render( self );
        TileViewContext.redraw( self );
    }

    static render( self ){
        self.renderingManager.render( STR.ID.rendering );
    }

    static redraw( self ){
        window.requestAnimationFrame( ()=>{ TileViewContext.draw( self ); } );
    }

    static updateFPS( self ){
		self.frameCounter++;
        if((new Date().getTime()) - self.frameTimeLast >= 1000){
			self.fps = self.frameCounter - self.frameCounterLast;
			self.frameTimeLast = new Date().getTime();
			self.frameCounterLast = self.frameCounter;
        }
    }

    static DEPRECIATED_clearRenderspaces( self, renderspaces ){
        self.renderingManager.contexts.rendering.fillStyle = new Color( 0,0,0,0 ).rgbaString;
        self.renderingManager.contexts.rendering.clearRect( 0,0,window.innerWidth,window.innerHeight );
	}
	




	static DEPRECIATED_drawRoutine_tile( routineData ){
		var range = TileScaleHelper.getViewRange( Townsend.viewContext ),
			tileNode = null,
			// NOTE
			// A new drawPacket is created every frame update
			// potential optimization would be to create a single global instance
			dataPacket = new TileDrawPacket( routineData, range ); // Defined in game/render/routines/tiledraw.js
		Townsend.analytics.range = range;
		nestedIncriment([-1, -1], [range.z+5, range.a+5], (x, y) => {
			tileNode = routineData.world.getObject(x + range.x, y + range.y);
			if( tileNode ){
				// Stop creating new ones, update to save memory
				// This works because everything is processed in order
				dataPacket.update(x, y);
				if (tileNode) {
					
					if(routineData.viewContext.frameCounter % routineData.viewContext.visualUpdateInterval == 0){
						tileNode.object.updateVisualState( dataPacket );
					}
					tileNode.object.drawRoutine(dataPacket);
				} else {
					Townsend.Tile.empty.drawRoutine(dataPacket);
				}
			}
		});
	}

	requestRedraw(){
		this.needsRedraw = true;
	}

}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilemap.js */
// Saves memory by storing redundant data in the same index
class TileMap extends BoPlane{
	constructor( rows, cols, defaultTile ){
		super( rows, cols, "payload" );
		
		this.forterator.default = this.createNode( 0, 0, defaultTile );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/world.js */
class World{
    constructor( saveData ){
		this.entities = [];
		this.chunkSize = cfg.world_chunkSize;
		this.defaultTile = Townsend.tiles.default;
		this.map = new UboPlane( {} ); // UboPlane<TileMap>
		this.chunks = [];
		this.chunkNeedsPrerender = [];

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

		this.time = 10;
		this.ticks = 0;

		this.specialTiles = {};
		this.specialTileLocations = {};

		// No world states go after this
		this.createNewMap();

		this.timeInterval = this.startTimeInterval();
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
		var payload = { position:position, tile:tile }
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
		this.placeObject( tile, x, y );
	}

	removeTile( x, y ){
		this.placeTile( Townsend.tiles.default, x, y );
	}

	update(){
		var self = this;
		if(self.paused){
			return;
		}
		self.ticks++;
		self.chunks.map( (chunk)=>{
			chunk.update(self.ticks);
		});
		self.entities.map( (entity)=>{
			entity.update(self.ticks);
		});
		setTimeout( ()=>{ self.update(); }, self.updateInterval);
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
		}
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
		}
	}

	/**
	 * Creates a new chunk at ( cx, cy )
	 * @param {Number} cx ChunkX
	 * @param {Number} cy ChunkY
	 */
	createChunk( cx,cy ){
		var self = this,
			chunk = new Chunk(self, this.chunkSize,new Vector(cx,cy) );
			
		nestedIncriment([0,0],[this.chunkSize,this.chunkSize],(tileX,tileY)=>{
			self.generateTile(chunk,tileX,tileY);
		});

		self.map.placeObject( cx, cy, chunk );

		// Depreciated
		this.chunkNeedsPrerender.push(chunk);
		this.chunks.push(chunk);

		//self.adjustRegionalBounds( cx, cy );
		//self.adjustBatchingCanvas();
		return chunk;
	}

	
	
	/**
	 * This is called to generate chunks by placing down some tiles
	 * atm its random.
	 * @param {TileMap} chunk 
	 * @param {Integer} tileX 
	 * @param {Integer} tileY 
	 */
	generateTile( chunk,tileX,tileY ){
		if (Math.random() <= cfg.world_treePlacementModifier) {
			chunk.t3_placeTile(Townsend.tiles.berryBush, tileX,tileY);
		}
	}

	createNewMap(){
		var self = this;
		nestedIncriment([-Math.floor( self.mapLength/2 ),-Math.floor( self.mapLength/2)],[ self.mapLength/2 ,self.mapLength/2],( cx, cy )=>{
			var chunk = self.createChunk(cx,cy);
			self.totalChunks++;
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
		Townsend.CVSCTX.batchLower.drawImage( Townsend.canvases.batchLowerResizePlaceholder, this.topLeftBoundResizeDiff.x, this.topLeftBoundResizeDiff.y )
		Townsend.CVSCTX.batchLower.drawImage( Townsend.canvases.batchLowerResizePlaceholder, this.topLeftBoundResizeDiff.x, this.topLeftBoundResizeDiff.y )
	}

	initialBatchRender(){
		while( this.chunkNeedsPrerender.length!=0 ){
			document.title = `Chunks left to prerender: ${this.chunkNeedsPrerender.length}`;
			this.chunkNeedsPrerender.pop().batchRender(  );
		}
	}
	
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/chunk.js */
class ChunkRenderer{
    constructor( chunk ){
        this.chunk = chunk;

        this.canvas = document.createElement("canvas");
        this.canvasCtx = this.canvas.getContext("2d");
        this.canvas.width = this.chunk.size * cfg.tile_size;
        this.canvas.height = this.chunk.size * cfg.tile_size;

        this.canvasOverflow = document.createElement("canvas");
        this.canvasOverflowCtx = this.canvasOverflow.getContext("2d");
        this.canvasOverflow.width = this.chunk.size * cfg.tile_size;
        this.canvasOverflow.height = this.chunk.size * cfg.tile_size;

        this.debug_color = new Color( Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255), 0.5 ).rgbaString;

        this.drawCalls = 0;

        this.tilesNeedRendering = [];
        this.firstRenderDone = false;
    }

    // Basically the chunk's drawn state stays static unless it's in view
    t3_drawProtocol(){
        this.drawCalls++;
        if( !this.firstRenderDone && Townsend.allTilesheetsLoaded ){
            this.drawFirst();
        }
        this.drawUnrendered();
        this.drawDynamic();
        //this.drawNeighborDependent();
    }

    drawFirst(){
        var coordVect = new CoordinateVector(0,0),
        globalTileCoordVect = null,
            self = this;
        nestedIncriment( [0,0], [this.chunk.size, this.chunk.size], (x, y)=>{
            coordVect.x = x;
            coordVect.y = y;
            globalTileCoordVect =this.chunk.globalTileOrigin.add( coordVect );
            
            self.chunk.getObject( x, y ).payload.tile.sprite.t3_drawRoutine( self.chunk, coordVect, globalTileCoordVect );
        });
        this.firstRenderDone = true;
        this.chunk.world.increaseRenderedChunks();
    }

    /**
     * Draws unrendered tiles, usually new ones seperate from drawFirst
     */
    drawUnrendered(){
        var self = this;
        while( self.tilesNeedRendering.length != 0 ){
            var node = self.tilesNeedRendering.pop(),
                coordVect = node.position,
                globalTileCoordVect = this.chunk.globalTileOrigin.add( coordVect );
            node.tile.sprite.t3_drawRoutine( self.chunk, coordVect, globalTileCoordVect );
        }
    }

     /**
     * Draw dynamic tiles
     */
    drawDynamic(){
        var self = this;
        Object.keys( this.chunk.dynamicTilesKeys ).map( ( key )=>{
            var node = this.chunk.dynamicTiles[ key ];
            node.tile.sprite.t3_drawRoutine( self.chunk, node.position, self.chunk.globalTileOrigin.add( node.position ) );
        });
    }

    // Updates a single neighbor dependent tile
    drawNeighborDependent(){
        if(this.chunk.neighborDependentTilesKeys.length == 0){return;}
        var node = this.chunk.neighborDependentTiles[ this.chunk.neighborDependentTilesKeys[ this.drawCalls % this.chunk.neighborDependentTilesKeys.length ]];
        node.tile.sprite.t3_drawRoutine( this.chunk, node.position, this.chunk.globalTileOrigin.add( node.position ) );
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
            {prop:"isNeighborDependent", ref:"neighborDependentTiles"},
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

        tile.eventEmitter.emit( "placed", tile, this.chunkRelCoordsToGlobalRelCoords( location ) );
    }

    markTileForRendering( tile, location ){
        this.renderer.tilesNeedRendering.push( Chunk.createTileNode( tile, location ) );
    }

    updateKeys(){
        this.specialTilesKeys = Object.keys( this.specialTiles );
        this.dynamicTilesKeys = Object.keys( this.dynamicTiles );
        this.neighborDependentTilesKeys = Object.keys( this.neighborDependentTiles );
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

/* File source: ../src/Ambitious_Dwarf///src/game/identifiableObject.js */
var IDENTITIES = [];

class IdentifiableObject{
    constructor(){
        this.identities = [];
        this.uuid = generateUUID(); // Defined in ^ utils/string.js
    }

    /**
	 * Add a unique identity to the tile, ie. it's name
	 * @param {String} identity 
	 */
	addIdentity( identity ){
        if(!IDENTITIES.includes(identity)){
            IDENTITIES.push(identity);
        }
		this.identities.push( IDENTITIES.indexOf( identity ) );
    }
    
    get identityString(){
        return this.identities.map( (index)=>{ return IDENTITIES[index]; } ).join("-");
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

/* File source: ../src/Ambitious_Dwarf///src/game/render/routines/cursorinteractioncontext.js */
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
	 * This method does not get overloaded
	 * @param {ViewComponent} viewComponent 
	 */
	VCCAssignDefault( viewComponent ){
		this.parentViewComponent = viewComponent;
		this.parentElement = viewComponent.renderingManager.canvases.default;

		// Create a data-package
		viewComponent.createCachePackage("mouseRawPos", this.position);
	}

	/**
	 * Routes to ViewComponent.getCachepackage
	 * @param {String} cacheIdentifier 
	 */
	getVCCachepackage( cacheIdentifier ){
		return this.parentViewComponent.getCachePackage( cacheIdentifier );
	}

	/**
	 * Requirement for VCCCompatableContextInterface
	 * return the context type identifier
	 * This method gets overloaded
	 * @param {ViewComponent} _ViewContext parent viewcomponent
	 * @returns {String} the context type identifier
	 */
	vccAssign(_ViewContext) {
		this.VCCAssignDefault( _ViewContext );
		return "CursorInteraction";
	}

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




/* File source: ../src/Ambitious_Dwarf///src/game/render/routines/mouseupdate.js */



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

		self.addHandler("onmousemove", self.handle_elementHover);
		self.addHandler("onmousemove", self.handle_placeBlock);
		self.addHandler("onmousemove", self.handle_moveMap);
		self.addHandler("onmousedown", self.handle_elementMousedown);
		self.addHandler("onmouseup", self.handle_elementMouseup);
		self.addHandler("onmousewheel", self.handle_debugScrollIncriment);
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

	/**
	 * Gets the location of the tile which the mouse is hovering on the element
	 * ! Requires bound RegionRenderContext
	 * @private
	 * @param {MouseEvent} event mouse event
	 */
	handle_elementHover(self, event) {
		Townsend.viewContext.requestRedraw();
		var tileSize = self.viewContext.tileScaleHelper.tileSize,
			position = self.position, // Mouse position, In pixels
			pixelOffset = self.parentViewComponent.pixelOffset; // View offset, in pixels
		
		// Some (hard to follow) math going on here
		self.tile = position
			.mutate() 							// Prepare vector for multiple operations
			.subtract( pixelOffset.add( self.viewContext.tileScaleHelper.cursorCorrection ) )			// Translate view-space pixel coordinates to tile-space pixel coordinates
			.scale( 1/tileSize ) 			// Transform tile-space pixel coordinates to tile-space coordinates, with sub-tile precision
			.forEach( Math.floor )				// Get rid of the decimal artifacts
			.forEach( (x)=>{ return x; } )  	// ¯\_(ツ)_/¯
			.unmutate();

		document.title = JSON.stringify(self.tile);
	}

	handle_placeBlock( self, event ){
		if(!Townsend.World) return;

		if( self.mousedown && self.events.onmousedown.button == 0 ){
			if( Object.className(Townsend.World.getTile( ...self.tile.values )) != "WallTile" ){
				Townsend.World.placeTile( Townsend.Tile.wall, ...self.tile.values );
			}
		}
	}

	handle_moveMap( self, event ){
		if(!self.events.onmousedown) return;
		if( self.events.onmousedown.button==1 && self.mousedown ){
			var delta = self.lastMousePosition.subtract( new Vector( event.clientX, event.clientY ) );
			self.viewContext.pixelOffset.values[0]-=delta.x;
			self.viewContext.pixelOffset.values[1]-=delta.y;
		}
		self.lastMousePosition = new Vector( event.clientX, event.clientY );
	}

	// Events and stuff

	handle_elementMousedown( self, event ){
		if(!Townsend.World) return;
		
		Townsend.viewContext.requestRedraw();
		self.mousedown = true;
		var objAtLocation = Townsend.World.getTile( ...self.tile.values );
		if( objAtLocation && objAtLocation.isWall && event.button==0 ){
			Townsend.World.placeTile( Townsend.Tile.debug, ...self.tile.values );
		}
		self.lastClickPosition.assign( [event.clientX, event.clientY] );
	}

	handle_elementMouseup( self, event ){
		Townsend.viewContext.requestRedraw();
		self.mousedown = false;
	}

	handle_debugScrollIncriment( self, event ){
		var signX = Math.sign( event.deltaY ),
			output = "";
		// Debug stuff goes here
		Townsend.VCTSH.scale-=0.25*signX;
		
		document.title = self.viewContext.tileScaleHelper.scale;
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

/* File source: ../src/Ambitious_Dwarf///src/game/render/sprite.js */
class Sprite{
    constructor(){
        this.source = Townsend.spriteSheets.grass;
        this.sources = {};

        this.width = cfg.tile_size;
        this.height = cfg.tile_size;
        
        
        this.wChunk = null;
		this.wPixelCoordVect = null;
		this.wGlobalTileCoordVect = null;
    }
    
    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates
	 */
	t3_drawRoutine( chunk, coordVect, globalTileCoordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.wChunk = chunk;
		this.wPixelCoordVect = pCoordVect;
		this.wGlobalTileCoordVect = globalTileCoordVect;
		this.t3_draw( chunk, pCoordVect, globalTileCoordVect );
    }

    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative tile coordinates
	 */
	t3_clearRenderingSpace( chunk, coordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.t3_clearGround( chunk, pCoordVect );
    }
    
    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_clearGround( chunk, pCoordVect ){
		var ctx = chunk.renderer.canvasCtx;
		ctx.clearRect( pCoordVect.x, pCoordVect.y, this.width, this.height );
	}
}

class PrerenderableSprite extends Sprite{
    constructor( prerenderOnConstruct ){
        super();
		this.prerenderWidth = cfg.tile_size;
		this.prerenderHeight = cfg.tile_size;
		this.needsPrerender = false;	// Set to true for tiles that need pre-rendering
		this.isPrerendered = false;
        this.hasDepth = false;		// If the tile sprite occupies more than a single tile-space

        if( prerenderOnConstruct ){
            this.prerender();
        }
    }

    prerender(){
		this.prerenderCanvas = document.createElement("canvas");
		this.prerenderCanvas.width = this.prerenderWidth;
		this.prerenderCanvas.height = this.prerenderHeight;
        this.prerenderCtx = this.prerenderCanvas.getContext("2d");
        this.t3_prerender();
		this.isPrerendered = true;
    }

    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates
	 */
	t3_drawRoutine( chunk, coordVect, globalTileCoordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.wChunk = chunk;
		this.wPixelCoordVect = pCoordVect;
		this.wGlobalTileCoordVect = globalTileCoordVect;
		if( this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready ){
			this.t3_prerender( chunk, pCoordVect, globalTileCoordVect );
		}
		this.t3_draw( chunk, pCoordVect, globalTileCoordVect );
    }

    t3_draw( chunk, pCoordVect, globalTileCoordVect ){}
	t3_prerender(){}
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

	/**
	 * Fill up the capacity of this item stack with the other itemStack
	 * @param {ItemStack} itemStack 
	 */
	fillWith( itemStack ){

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
	get maxStackSize(){ return this.item.maxStackSize }
}

class ItemSprite extends Sprite{
	constructor( item ){
		super();
		this.item = item;
	}
}

class Item extends IdentifiableObject{
	constructor( name ){
		super();
		this.name = name;
		this.sprite = new ItemSprite(this);
		this.addIdentity("item");
	}

	get description(){}
	get value(){}
	get volume(){}
	get maxStackSize(){ return 128; }

	createItemStack( stackSize ){
		return new ItemStack( this, Math.clamp( 1, this.maxStackSize, stackSize ));
	}
}

/**
 * Resources are any kind of item used for a purpose
 */
class ResourceItem extends Item{
	constructor( name ){
		super( name );
		this.addIdentity("resource");
	}
}

class StoneItem extends ResourceItem{
	constructor(){
		super("stone");
		this.addIdentity("stone");
	}
}

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
        this.neighbors = Townsend.neighborOffsetVectorList; // cfg.pathfinding_cost_vh
        this.neighborsDiagonal = Townsend.neighborDiagonalOffsetVectorList; // cfg.pathfinding_cost_diagonal
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
        this.time = {start: new Date().getTime()}
        this.destination = null;

        // Analytics
        this.analytics = {
            loops:{
                nextIteration_calls: 0,
                nextIteration_nodeSearches: 0,
                nextIteration_neighborMaps: 0
            },
            times:[],
            // in intervals of n tiles
            distanceCost:{

            }
        }
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
     * Runs within a promise
     * @param {this} self 
     */
    nextIteration( self ){
        for( var batchIteration = 0; batchIteration < cfg.pathfinding_batch_size; batchIteration++ ){
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
            // find closest node to the destination
            var workingNode = self.findNextAvailableNode();
            
            

            // get neighbours of that node, make sure the neighbor isn't already a part of the list
            var neighborCounter = 0;    
            self.neighbors.map( ( offsetVector, i, arr )=>{
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
                    neighborCounter++;
                    if( neighborCounter == arr.length-1){
                        workingNode.open = false;
                    }
                }
                
                self.analytics.nextIteration_neighborMaps++;
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
class EntitySprite extends PrerenderableSprite{
	constructor(entity){
		super( true );

		if(Object.isUndefined( entity )){ throw "Error, tried constructing EntitySprite with no entity linked"; }
		this.entity = entity;

		this.source = Townsend.spriteSheets.placeholders;
		this.sourceKey = this.source.getSpriteAt( 0, 1 );
		this.spriteSource = this.source; // Disambiguation 
		this.animationStartTime = new Date().getTime();

		this.wPixelCoordVect = null;
		this.wGlobalTileCoordVect = null;

		// Tweak the sprite's pixel location by this much
		this.spriteShift = new Vector(0,0);
	}

	t3_drawRoutine(){
		var pCoordVect = this.entity.globalPixelPosition.add( Townsend.viewContext.pixelOffset ).add(this.spriteShift);
		this.wPixelCoordVect = pCoordVect;
		if( this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready ){
			this.t3_prerender();
		}
		this.t3_draw( pCoordVect );
    }

	/**
	 * Chances are, the entity won't be asked to be drawn unless it's in range of the screen.
	 * So all those other parameters are pretty useless
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_draw( pCoordVect ){}
	t3_prerender(){}

}

class EntityJob{
	constructor( destination = new Vector(0,0) ){
		this.destination = destination;
	}

	createProtocolInstance(){
		return [
			{task:"move", params:this.destination }
		];
	}
}

class Entity extends IdentifiableObject{
	/**
	 * 
	 * @param {Number} health 
	 */
	constructor(){
		super();
		var self = this;
		
		// Event stuff
		this.eventEmitter = new SimpleEventEmitter( 10000 );

		// Positional stuff
		this.globalTilePosition = new Vector(0,0); // Global coordinates of the entity
		this.previousGlobalTilePosition = this.globalTilePosition.copy();	// Previous coordinates of the entity ( for animation )
		this.nextGlobalTilePosition = new Vector(0,0); // Next coordinate this entity will be in ( for animation )
		this.positionOffset = new Vector(0,0); // Offset of entity within tile-region
		this.chunk = Townsend.World.getChunkFromTile( ...this.globalTilePosition.values ); // The chunk the entity is currently on
		
		// World interaction stuff
		this.action = null;
		this.actionName = "idle";
		this.tasks = [];
		this.jobs = [];
		this.tick=0;
		this.sprite = new EntitySprite( this );
		this.addIdentity("entity");

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
	
	task_idle(){}





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
	 * f(x) = tilePosition * tileSize + pixelScaleCoefficent * pixelOffset
	 * 			( Major position )	  +		( Minor position )
	 */
	get globalPixelPosition(){
		return this.globalTilePosition.scale( Townsend.VCTSH.tileSize ).add( this.positionOffset.scale( Townsend.VCTSH.coefficent ) );
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
		this.name = "entity";
		this.level = 1;
		this.hungerLevel = 0; // 0 = not hungry, 10 = starving
		this.thirstLegvel = 0; // 0 not thirsty, 10 severely dehydrated
		this.performance = {
			strength: 1,	// Determines inventory size
			endurance: 1,	// Determines 
			agility: 5+Math.floor( Math.random()*10 ),		// Determines walking speed
			charisma: 1 	// Determines how much other entities like this entity
		};
    }

    // Hard cap on movementspeed is 5 ticks per tile
	get ticksPerTileTransition(){
		return Math.max( 5, 20-this.performance.agility );
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

		/**11/5/18
		 * Disambiguation
		 * Actions: The do's of an entity (per tick)
		 * Protocols: The how-to-do's of an entity
		 * Tasks: High level stuff ( build this, find that )
		 * 
		 * Tasks > Protocols > Actions > State changes
		 */
        
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

			// Start walking!
			self.eventEmitter.emit( "actionStartWalking", self );
			self.switchAction("walk");
		},
		( pathfindingError )=>{
			self.eventEmitter.emit( "pathfindingPathNotFound", self, pathfindingError );
			// Handle pathfinding errors here
		});
		//this.moveTo( x, y );
    }
    
    action_idle(){
		this.eventEmitter.emit( "actionStartIdle", self );
		var idleWalkLocation = this.globalTilePosition.forEach( ( n )=>{
			return -cfg.entity_roam_length/2 + Math.floor(Math.random()*cfg.entity_roam_length) + n ;
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
			this.nextGlobalTilePosition = this.pathfindingAI.path.pop()
			this.walkStartTick = this.tick; // Reset for delta tick [11/6/18]

			// Find new path if current one is blocked by obstacle [11/6/18]
			if( !EntityLiving.pathfindingDetectObsticle( Townsend.World.getTile( ...this.nextGlobalTilePosition.values ) ) ){
				// Switch the action, handle the event
				this.switchAction("repathfinding");
				this.eventEmitter.emit( "walkingInterruptedUnaccountedObstacle", self, this.pathfindingAI.destination );
				return;
			}

			this.moveTo( ...this.nextGlobalTilePosition.values );

			// Stop this action once the destination is reached [11/6/18]
			if(this.pathfindingAI.path.length==0){
				this.switchAction("idle");
				this.eventEmitter.emit( "actionDestinationReached", self );
				return;
			};
		}
    }
    
    on_walkingInterruptedUnaccountedObstacle( destination ){
		this.task_move( destination.values );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/entity/person.js */
class EntitySpritePerson extends EntitySprite{
	constructor( entity ){
		super( entity );
		this.source = Townsend.spriteSheets.DFEntities;
		//this.spriteKey = new Vector();
		this.spriteSize = new Vector( 16, 16 )
	}

	t3_draw( pCoordVect ){
		var actionKey = `t3_draw_${this.entity.actionName}`;
		if( !this[actionKey] ){ actionKey = `t3_draw_idle` }
		this[actionKey]( pCoordVect );
	}

	t3_draw_idle( pCoordVect ){
		// Location of sprite as a product of ~~time~~ ticks
		//var spriteKey = Math.floor( (this.animationStartTime + new Date().getTime()) / (1000) ) % 2;
		this.source.drawPartialSprite(
			Townsend.CVSCTX.entities,
			//this.source.getTileAt(4+(this.entity.sex*4), this.spriteKey ),
			this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect,
			...this.spriteSize.scale( Townsend.VCTSH.coefficent ).values
		);
	}

	t3_draw_walk( pCoordVect ){
		//var spriteKey = Math.floor( (this.animationStartTime + new Date().getTime()) / (1000) ) % 2;
		this.source.drawPartialSprite(
			Townsend.CVSCTX.entities,
			//this.source.getTileAt(4+(this.entity.sex*4), this.spriteKey ),
			this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect,
			...this.spriteSize.scale( Townsend.VCTSH.coefficent ).values
		);
	}
}

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
	Simple tiles aren't unique.

	Provides a tempalte for every other form of tile to build upon
	
	Complex Tiles store data and perform their own operations
	
	Tile
		SimpleTile
			ResourceTile
			DecorTile
			
		ComplexTile
			ContainerTile
			OperatorTile
			TransporterTIle
*/

class TileSprite extends PrerenderableSprite{
	constructor( tile ){
		super();
		this.tile = tile;
		this.width = cfg.tile_size;
		this.height = cfg.tile_size;
		
		// Sprite source and the key to the sprite if the sprite is static
		this.source = Townsend.spriteSheets.placeholders;
		this.sourceKey = this.source.getSpriteAt( 0,0 );

		// Other stuff
		this.staticSpriteLocation = this.source.getSpriteAt( 1, 0 );
		this.staticGroundLocation = Townsend.spriteSheets.grass.getSpriteAt(1,1);
		this.spritePixelOffset = new Vector( 0,2 );	// The offset of a sprite
		this.spritePixelOverflowOffset = this.calculateOverflowOffset(); // This is what Chunk.canvasOverflow is for
	}

	calculateOverflowOffset(){
        return new Vector( 0, cfg.tile_size - this.spritePixelOffset.y );
    }

	t3_prerender( chunk, coordVect, globalTileCoordVect ){

	}


	/**
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates, if that's important
	 */
	t3_draw( chunk, pCoordVect, globalTileCoordVect ){
		this.source.drawTile(
			chunk.renderer.canvasCtx,
			this.sourceKey,
			pCoordVect,
			cfg.tile_size, cfg.tile_size
		);
		//this.t3_drawGround(chunk, pCoordVect );
	}

	/**
	 * A simple helper to draw the ground for non-solid tiles
	 * @param {Chunk} chunk Chunk
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_drawGround( chunk, pCoordVect ){
		Townsend.spriteSheets.grass.drawTile(
			chunk.renderer.canvasCtx,
			this.staticGroundLocation,
			pCoordVect,
			cfg.tile_size, cfg.tile_size
		);
	}

	/**
	 * Draw a sprite that uses layers
	 * @param {Tilesheet} source 
	 * @param {Chunk} chunk 
	 * @param {CooedinateVector} tileLocation 
	 * @param {Vector} spritePixelOffset 
	 * @param {Vector} spritePixelOverflowOffset 
	 * @param {CoordinateVector} pCoordVect 
	 */
	static drawLayeredTile( source, chunk, tileLocation, spritePixelOffset, spritePixelOverflowOffset, pCoordVect ){
		source.drawPartialTile(
            chunk.renderer.canvasCtx,
            tileLocation.add( spritePixelOffset ),
            cfg.tile_size, spritePixelOverflowOffset.y,
            pCoordVect,
            cfg.tile_size, spritePixelOverflowOffset.y
        );
        source.drawPartialTile(
            chunk.renderer.canvasOverflowCtx,
            tileLocation,
            cfg.tile_size, spritePixelOffset.y,
            pCoordVect.add( spritePixelOverflowOffset ),
            cfg.tile_size,spritePixelOffset.y
        );
	}

	/**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative tile coordinates
	 */
	t3_clearRenderingSpace( chunk, coordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.t3_clearGround( chunk, pCoordVect );
		this.t3_clearOverflow( chunk, pCoordVect )
	}

	/**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_clearOverflow( chunk, pCoordVect ){
		var ctx = chunk.renderer.canvasOverflowCtx;
		ctx.clearRect( pCoordVect.x, pCoordVect.y, cfg.tile_size, cfg.tile_size );
	}
}




class Tile extends IdentifiableObject{
	constructor(){
		super();
		this.needsVisualUpdate = false;
		this.tileSize = cfg.tile_size;
		this.eventEmitter = new SimpleEventEmitter(0);

		// Template properties
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighborDependent = false; // If the sprite state depends on it's neighbors
		this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
		this.sprite = new TileSprite( this );
		this.isSpecialTile = false;
		this.isBuildable = false; // If the tile can be built by an entity

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

	////////////
	// EVENTS //
	////////////

	setupEvents(){
		var properties = Object.getAllOwnPropertyNames( this );
		var events = properties.filter( propName => (/^on_\w+$/m).test( propName ) );
		events.map( propName => this.eventEmitter.on( propName.split("on_")[1], this[propName] ), this );
	}
	
	get defaultMetadata(){
		return {};
	}

	static get neighbors(){
		return Townsend.neighborOffsetVectorList;
	}


	getTileSpriteLocation(){}

	updateVisualState( drawData ){

	}

	check_hovered( data ){
		if( data.viewContext.cursor.tile.equals( data.coords ) ){			
			this.drawHovered( data );
		}
	}

	/**
	 * When the mouse is hovered over a tile
	 */
	static create_event_hovered(){}
	on_hovered( event ){
		
	}

	/**
	 * "Constructed" event container
	 * @param {*} world 
	 * @param {*} x 
	 * @param {*} y 
	 */
	static create_event_constructed( world, x, y ){
		return {
			world:world,
			x:x,
			y:y
		}
	}
	/**
	 * When a tile is constructed by an entity
	 * @param {event_constructed} event 
	 */
	on_constructed( self, x, y ){

	}

	/**
	 * When a tile is spawned in ( spawn routines, other tiles, or by cheating)
	 */
	static create_event_spawned(){}
	on_spawned(self, x, y){

	}

	/**
	 * When a tile is placed after being picked up
	 */
	static create_event_placed(){}
	on_placed( self, x, y ){

	}

	/**
	 * When a tile is removed
	 */
	static create_event_removed(){}
	on_removed( self, x, y ){

	}

	/**
	 * When an entity goes on top of a tile
	 */
	static create_event_entity_above(){}
	on_entity_above( self, x, y ){

	}

	/**
	 * When an entity is next to a tile
	 */
	static create_event_entity_adjacent(){}
	on_entity_adjacent( self, x, y ){

	}

	/**
	 * when a tile gets destroyed by means of destruction
	 */
	static create_event_destroyed(){}
	on_destroyed( self, x, y ){

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
		a = Math.floor((Math.floor(data.time*cfg.sprite_ground_flowFrameCoefficent)+(data.to.x-Math.sin(data.to.y/cfg.sprite_ground_flowSizeCoefficent))*states+(data.to.y)*states)%states),
		location = tilesheet.getTileAt( cfg.sprite_ground_y, a );	// Tile Sprite location
		//Math.round(7+(Math.abs(Math.sin( Math.floor(viewContext.frameCounter/10) + Math.pow((data.to.x+data.to.y),2)/4)))*4) 
		Townsend.analytics.flow = a;
	}
	*/
}



/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/forageable.js */
class ForageableTile extends Tile{
    constructor(){
        super();
        this.isForageable = true;
    }

    on_foraged(){
        
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/debug.js */
class TileDebug extends Tile{
    constructor(){
        super();
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

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/wall.js */
class TileSpriteWall extends TileSprite{
    constructor( tile ){
        super( tile );
        this.spriteLocation = null;
        this.requestSpriteUpdate = true;
        this.source = Townsend.spriteSheets.DFDefault;
    }

    static get spriteConfigs(){
        return {
            "single":[12,7],
            "corner_top_left":[12,9],
            "corner_top_right":[11,11],
            "corner_bottom_left":[12,8],
            "corner_bottom_right":[11,12],
            "junction_top_left_right":[12,10],
            "junction_bottom_left_right":[12,11],
            "horizontal":[12,13],
            "vertical":[11,10],
            "junction_left_top_bottom":[11,9],
            "junction_right_top_bottom":[12,12],
            "junction_t":[12,14]
        };
    }

    static get adjacentSpriteMap(){
        return {
            "0101":"horizontal",
            "1010":"vertical",
            "0011":"corner_top_right",
            "0110":"corner_top_left",
            "1100":"corner_bottom_left",
            "1001":"corner_bottom_right",
            "1111":"junction_t",
            "1101":"junction_top_left_right",
            "0111":"junction_bottom_left_right",
            "1011":"junction_left_top_bottom",
            "1110":"junction_right_top_bottom"
        };
    }

    t3_draw( chunk, pCoordVect, globalTileCoordVect ){
        this.source.drawTile(
            chunk.renderer.canvasCtx,
            this.t3_getTileSpriteLocation( globalTileCoordVect ),
            pCoordVect,
            cfg.tile_size,cfg.tile_size);
    }

    t3_getTileSpriteLocation( globalTileCoordVect ){
        var neighbors = Tile.neighbors,
            tilesheet = this.source,
            spriteMapKey = this.t3_getSpriteMapKey( globalTileCoordVect );

        // If there is a sprite configuration defined
        var spriteConfigKey = TileSpriteWall.adjacentSpriteMap[ spriteMapKey ];
        
        if( spriteConfigKey ){
    
            return tilesheet.getTileAt( ...TileSpriteWall.spriteConfigs[ spriteConfigKey ] );
        }
        return tilesheet.getTileAt( ...TileSpriteWall.spriteConfigs.single );
    }

    t3_getSpriteMapKey( globalTileCoordVect ){
        return Tile.neighbors.map( ( offsetVector )=>{
            var neighbour = globalTileCoordVect.add( offsetVector ),
                neighbourTileObject = Townsend.World.getTile( neighbour.x, neighbour.y );
            if(!neighbourTileObject){return 0;}
            //console.log( neighbourTileObject, neighbour, offsetVector, globalTileCoordVect );
            var isWallTile = neighbourTileObject.isWall;
            return isWallTile ? 1 : 0;
        }).join('');
    }
}

class TileWall extends Tile{
    constructor(){
        super();
        this.isWall = true;
        this.isObstacle = true;
        this.isNeighborDependent = true;
        this.sprite = new TileSpriteWall( this );

        this.addIdentity("wall");
    }

    on_placed( gCoordVect ){
        var position = gCoordVect;
        Townsend.neighborOffsetVectorList.map( ( offsetVector )=>{
            var neighborLocation = position.add(offsetVector);
            if( Townsend.World.tileExists(...neighborLocation.values)){
                var extendedTileData = Townsend.World.getTilePlus( ...neighborLocation.values );
                // If the tile is the same kind of tile as this tile
                if( extendedTileData.tile.identityString == this.identityString ){
                    
                    extendedTileData.chunk.markTileForRendering( extendedTileData.tile, extendedTileData.chunkRelPosition );
                }
            }
        });
    }







    DEPRECIATED_updateVisualState( drawData ){
        if( this.requestSpriteUpdate ){
            this.spriteLocation = this.getTileSpriteLocation( drawData.TS.DFDefault, drawData );
            this.requestSpriteUpdate = false;
        }
    }

    /**
     * Override of the basic tile.draw
     * @param {*} drawData 
     */
    DEPRECIATED_draw( drawData ){
        var tilesheet = drawData.TS.DFDefault,				// Tilesheet
            parent = drawData.parent,				// Parent data
            viewContext = drawData.viewContext,
            tileSize = viewContext.tileScaleHelper.tileSize;
            
        /*if( ! this.spriteLocation ){
            this.spriteLocation = this.getTileSpriteLocation( tilesheet, drawData );
        }*/
        
        tilesheet.drawTile(
            parent.ctx,
            this.getTileSpriteLocation( tilesheet, drawData ),
            new Vector(	drawData.to.x, drawData.to.y ),
            tileSize,
            tileSize);
            
        this.check_hovered( drawData );
    }

    DEPRECIATED_getSpriteMapKey( drawData ){
        return Tile.neighbors.map( ( coordVector )=>{
            var neighbour = drawData.coords.add( coordVector ),
                neighbourTileObject = drawData.routineData.world.getTile( neighbour.x, neighbour.y ).payload.tile,
                isWallTile = neighbourTileObject.isWall;
            return isWallTile ? 1 : 0;
        }).join('');
    }

    DEPRECIATED_getTileSpriteLocation( tilesheet, drawData ){
        var neighbors = Tile.neighbors,
            spriteMapKey = this.getSpriteMapKey( drawData );
    
        // If there is a sprite configuration defined
        var spriteConfigKey = WallTile.adjacentSpriteMap[ spriteMapKey ];
        
        if( spriteConfigKey ){
    
            return tilesheet.getTileAt( ...WallTile.spriteConfigs[ spriteConfigKey ] );
        }
        return tilesheet.getTileAt( ...WallTile.spriteConfigs.single );
    }

    DEPRECIATED_on_constructed( event ){
        var location  = ( new Vector( event.x, event.y ));
        return Tile.neighbors.map( ( coordVector )=>{
            var neighbour = location.add( coordVector ),
                neighbourTileObject = event.world.getTile( neighbour.x, neighbour.y ).payload.tile;
            if( neighbourTileObject ){
                var isWallTile = neighbourTileObject.isWall;
                if( isWallTile ){
                    neighbourTileObject.requestSpriteUpdate = true;
                }
            }
        });
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/bush.js */
class TileSpriteBush extends TileSprite{
    constructor( tile ){
        super( tile );
        this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
        this.source = Townsend.spriteSheets.plants1;
        this.staticSpriteLocation = this.source.getTileAt( 0, 0 );
        this.staticGroundLocation = Townsend.spriteSheets.grass.getTileAt(1,2);
        this.spritePixelOffset = new Vector( 0,2 );
        this.spritePixelOverflowOffset = this.calculateOverflowOffset();

        // Prerendering stuff
		this.prerenderWidth = cfg.tile_size;
		this.prerenderHeight = cfg.tile_size;
		this.needsPrerender=false;	// Set to true for tiles that need pre-rendering
		this.isPrerendered=false;
        this.hasDepth=false;		// If the tile sprite occupies more than a single tile-space
        
        this.bushSpriteIndex = 0;
        this.bushSpriteCount = 0;

        this.isObstacle = true;
    }

    t3_draw( chunk, pCoordVect ){
        var randomSprite = Math.floor(Math.random()* 3),    
            randomSpriteLocation = this.source.getTileAt( this.bushSpriteIndex, randomSprite );
        
        this.t3_drawGround( chunk, pCoordVect );
        TileSprite.drawLayeredTile( this.source, chunk, randomSpriteLocation, this.spritePixelOffset, this.spritePixelOverflowOffset, pCoordVect );
    }
}

class TileBush extends ForageableTile{
    constructor(){
        super();
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighborDependent = false; // If the sprite state depends on it's neighbors
        this.sprite = new TileSpriteBush( this );
        this.addIdentity("bush");   
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/berrybush.js */
class TileBerryBush extends TileBush{
    constructor(){
        super();
        this.addIdentity("berry");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/storage.js */
class StorageTile extends Tile{
    constructor(){
        super();

        // Template properties
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighborDependent = false; // If the sprite state depends on it's neighbors
		this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
        this.sprite = new TileSprite( this );
        
        // Physical properties
		this.isObstacle = false;

        this.addIdentity("storage");
        
        this.inventory = new Inventory( this.maxItemAmount );
        
    }

    get maxItemAmount(){ return 128; }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/stockpile.js */
class StockPileTile extends StorageTile{
    constructor(){
        super();
        this.isSpecialTile = true;   
    }

    get isFull(){
        return this.items == this.maxItemAmount;
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/grass.js */
class TileSpriteGrass extends TileSprite{
	constructor( tile ){
		super( tile );
		this.spritePixelOffset = new Vector( 0,4 );	// The offset of a sprite
        this.spritePixelOverflowOffset = this.calculateOverflowOffset(); // This is what Chunk.canvasOverflow is for
	}

	t3_draw( chunk, pCoordVect ){
		// Ground Grass tile
		this.staticGroundLocation = Townsend.spriteSheets.grass.getTileAt(2,1);
		this.t3_drawGround( chunk, pCoordVect );

		// Decals
		var randomSprite, randomSpriteLocation;
		if( Math.random() < 0.1){
			// Big plants
			randomSprite= Math.floor(Math.random()* 6);
			this.staticGroundLocation = Townsend.spriteSheets.grass.getTileAt(1,3);
            randomSpriteLocation = Townsend.spriteSheets.plants1.getTileAt( 1, randomSprite );
			TileSprite.drawLayeredTile( Townsend.spriteSheets.plants1, chunk, randomSpriteLocation, this.spritePixelOffset, this.spritePixelOverflowOffset, pCoordVect );
		}else{
			// Grass overlays
			randomSprite= Math.floor(Math.random()* 6);
			randomSpriteLocation = Townsend.spriteSheets.plants1.getTileAt( 4, randomSprite );
			Townsend.spriteSheets.plants1.drawTile(
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

/* File source: ../src/Ambitious_Dwarf///src/game/map/tiles/generics.js */
Townsend.tiles.generic = new Tile();
Townsend.tiles.empty = new TileEmpty();
Townsend.tiles.debug = new TileDebug();
Townsend.tiles.grass = new TileGrass();
Townsend.tiles.wall = new TileWall();
Townsend.tiles.genericBush = new TileBush();
Townsend.tiles.berryBush = new TileBerryBush();

Townsend.tiles.default = Townsend.tiles.grass;
Townsend.Tile = Townsend.tiles;

Object.values(Townsend.tiles).map( (genericTile)=>{
    genericTile.addIdentity("generic");
});
// Labels

/////////////////
// Depreciated //
/////////////////

/* File source: ../src/Ambitious_Dwarf///src/game/gui/menuitem.js */
class MenuItem{
    constructor( iconElement, tooltip ){
        this.eventEmitter = new SimpleEventEmitter();

        this.icon = iconElement;
        this.iconContainer = document.createElement("div");
        this.iconContainer.classList.add( "menu-item-img-container" );
        this.element = document.createElement("div");
        this.element.classList.add( "menu-item" );

        this.iconContainer.appendChild(this.icon);
        this.element.appendChild(this.iconContainer);
    }

    link( menuContainer ){
        this.menuContainer = menuContainer;
        this.menuContainer.element.appendChild(this.element);

        var self = this;
        this.icon.addEventListener("click", ()=>{self.on_click.apply(self);});
    }

    on_click(){
        var nextSubmenu = this.menuContainer.submenu.nextSubmenu;
        if(nextSubmenu){
            nextSubmenu.collapse();
        }
        this.on_activate();
    }

    on_activate(){
        console.log("Unlinked action");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/submenucontainer.js */
class SubmenuItemContainer{
    constructor(){
        this.element = document.createElement("div");
        this.element.classList.add("submenu-item-container");
        this.menuItems = [];
    }

    addMenuItem( menuItem ){
        this.menuItems.push( menuItem );
        menuItem.link( this );
    }

    link( submenu ){
        this.submenu = submenu;
        submenu.element.appendChild(this.element);
    }

    show(){
        this.element.classList.add("submenu-item-container-active");
    }

    hide(){
        this.element.classList.remove("submenu-item-container-active");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/submenu.js */
class Submenu{
    constructor(){
        this.submenuContainers = {};
        this.element = document.createElement("div");
        this.element.classList.add( "submenu" );
    }

    link( controlMenu ){
        this.controlMenu = controlMenu;
        controlMenu.element.prepend( this.element );
    }

    setNextSubmenu( submenu ){
        this.nextSubmenu = submenu;
    }

    addContainer( identifier, subMenuContainer ){
        this.submenuContainers[identifier] = subMenuContainer;
        subMenuContainer.link(this);
    }

    show( identifier ){
        this.submenuContainers[ identifier ].show();
    }

    collapse(){
        Object.keys( this.submenuContainers ).map( ( identifier )=>{
            this.submenuContainers[ identifier ].hide();
        }, this );
    }

    on_blur(){
        this.collapse();
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/controlmenu.js */
class ControlMenu{
    constructor(){
        this.submenus = [];
        this.mainSubmenu = null;
        this.element = document.createElement("div");
        this.element.classList.add("control-menu");
    }

    addSubmenu( submenu ){
        if(!this.mainSubmenu) this.mainSubmenu = submenu;
        this.submenus.push(submenu);
        if(this.submenus.length > 1){
            var lastSubmenu = this.submenus[this.submenus.length-2];
            lastSubmenu.setNextSubmenu( submenu );
        }
        submenu.link(this);
    }

    collapse(){
        this.submenus.map( (submenu)=>{
            submenu.collapse();
        });
        this.mainSubmenu.show("default");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/example.js */
// Define the buttons
var buttonBuild = new MenuItem( createSource.img("src/assets/build.png") );
var buttonPeople = new MenuItem( createSource.img("src/assets/person.png") );
var buttonStats = new MenuItem( createSource.img("src/assets/stats.png") );

// Define the submenucontainer
var smbcMainControls = new SubmenuItemContainer();
// Add buttons to submenucontainer
smbcMainControls.addMenuItem( buttonBuild );
smbcMainControls.addMenuItem( buttonPeople );
smbcMainControls.addMenuItem( buttonStats );

// Repeat
var buttonBuildAll = new MenuItem( createSource.img("src/assets/all.png") );
var buttonBuildWalls = new MenuItem( createSource.img("src/assets/wall.png") );
var buttonBuildDeconstruct = new MenuItem( createSource.img("src/assets/hammer.png") );

var smbcBuildingControls = new SubmenuItemContainer();

smbcBuildingControls.addMenuItem( buttonBuildAll );
smbcBuildingControls.addMenuItem( buttonBuildWalls );
smbcBuildingControls.addMenuItem( buttonBuildDeconstruct );

// Create a new submenus
var submenuMain = new Submenu();
submenuMain.addContainer( "default", smbcMainControls );
var submenu2 = new Submenu();
submenu2.addContainer( "building-controls", smbcBuildingControls );

var menu = new ControlMenu();
menu.addSubmenu( submenuMain );
menu.addSubmenu( submenu2 );

buttonBuild.on_activate = ()=>{
    smbcBuildingControls.show();
};

smbcMainControls.show();
document.body.appendChild(menu.element);


/* File source: ../src/Ambitious_Dwarf///src/script.js */
var _TileViewContext, world, heap;
Townsend.analytics.flow = 0;

function init() {

	//initializeTileDrawRoutine();
	_TileViewContext = new TileViewContext();
	Townsend.viewContext = _TileViewContext;
	Townsend.canvases = Townsend.viewContext.renderingManager.canvases;
	Townsend.canvasContexts = Townsend.viewContext.renderingManager.contexts;

	// Shorthands
	Townsend.VC = Townsend.viewContext;
	Townsend.VCTSH = Townsend.viewContext.tileScaleHelper;
	Townsend.CVS = Townsend.canvases;
	Townsend.CVSCTX = Townsend.canvasContexts;


	world = new World();
	Townsend.World = world;
	
	
	// Townsend.locked.doBatching
	

	_TileViewContext.initDrawRoutines();
	_TileViewContext.draw();
	_TileViewContext.tileScaleHelper.scale = 0.25;
	// Well, it renders. The cursor context needs work though
	
	
	if(cfg.debug_heapUsed_enable){
		setInterval(()=>{
			Townsend.heap = process.memoryUsage();
		},100);
	}
	createDebugWindow();

	Townsend.World.update();

	
	for( var i = 0; i < 100; i++ ){
		Townsend.World.entities.push( new EntityPerson() );
	}
}

// No

function createDebugWindow(){
	dbgWindow = new DebugWindow( cfg.debug_window_Width );
	dbgWindow.addWatcher( _TileViewContext, "fps", (a)=>{return a.fps;} );
	dbgWindow.addWatcher( _TileViewContext.cursor.position.values, "mp" );
	dbgWindow.addWatcher( null, "heapUsed", (n)=>{ if(window.heap.heapUsed/1024/1024>cfg.memory_max){process.exit();}return Math.floor(window.heap.heapUsed/1024/1024)+"/"+Math.floor(window.heap.heapTotal/1024/1024)+" Mb";} );
	dbgWindow.addWatcher( null, "analytics_flow", ()=>{ return Townsend.analytics.flow; } );
	dbgWindow.addWatcher( _TileViewContext.pixelOffset, "pixeloffset" );
	dbgWindow.addWatcher( Townsend.analytics, "general_analytics");
}

init();

/* File source: ../src/Ambitious_Dwarf///src/engine/window.js */
const WINDOW_DEFAULT_PROPERTY_NAMES = {"Object":true,"Function":true,"Array":true,"Number":true,"parseFloat":true,"parseInt":true,"Infinity":true,"NaN":true,"undefined":true,"Boolean":true,"String":true,"Symbol":true,"Date":true,"Promise":true,"RegExp":true,"Error":true,"EvalError":true,"RangeError":true,"ReferenceError":true,"SyntaxError":true,"TypeError":true,"URIError":true,"JSON":true,"Math":true,"console":true,"Intl":true,"ArrayBuffer":true,"Uint8Array":true,"Int8Array":true,"Uint16Array":true,"Int16Array":true,"Uint32Array":true,"Int32Array":true,"Float32Array":true,"Float64Array":true,"Uint8ClampedArray":true,"BigUint64Array":true,"BigInt64Array":true,"DataView":true,"Map":true,"Set":true,"WeakMap":true,"WeakSet":true,"Proxy":true,"Reflect":true,"decodeURI":true,"decodeURIComponent":true,"encodeURI":true,"encodeURIComponent":true,"escape":true,"unescape":true,"eval":true,"isFinite":true,"isNaN":true,"ByteLengthQueuingStrategy":true,"CountQueuingStrategy":true,"ReadableStream":true,"WritableStream":true,"TransformStream":true,"webkitRTCPeerConnection":true,"webkitMediaStream":true,"WebSocket":true,"WebGLContextEvent":true,"WaveShaperNode":true,"TextEncoder":true,"TextDecoder":true,"SyncManager":true,"SubtleCrypto":true,"StorageEvent":true,"Storage":true,"StereoPannerNode":true,"SourceBufferList":true,"SourceBuffer":true,"ScriptProcessorNode":true,"ScreenOrientation":true,"RTCTrackEvent":true,"RTCStatsReport":true,"RTCSessionDescription":true,"RTCRtpTransceiver":true,"RTCRtpSender":true,"RTCRtpReceiver":true,"RTCRtpContributingSource":true,"RTCPeerConnectionIceEvent":true,"RTCPeerConnection":true,"RTCIceCandidate":true,"RTCDataChannelEvent":true,"RTCDataChannel":true,"RTCDTMFToneChangeEvent":true,"RTCDTMFSender":true,"RTCCertificate":true,"Plugin":true,"PluginArray":true,"PhotoCapabilities":true,"PeriodicWave":true,"PannerNode":true,"OverconstrainedError":true,"OscillatorNode":true,"OfflineAudioContext":true,"OfflineAudioCompletionEvent":true,"NetworkInformation":true,"MimeType":true,"MimeTypeArray":true,"MediaStreamTrackEvent":true,"MediaStreamTrack":true,"MediaStreamEvent":true,"MediaStream":true,"MediaStreamAudioSourceNode":true,"MediaStreamAudioDestinationNode":true,"MediaSource":true,"MediaSettingsRange":true,"MediaRecorder":true,"MediaEncryptedEvent":true,"MediaElementAudioSourceNode":true,"MediaDevices":true,"MediaDeviceInfo":true,"MediaCapabilities":true,"MIDIPort":true,"MIDIOutputMap":true,"MIDIOutput":true,"MIDIMessageEvent":true,"MIDIInputMap":true,"MIDIInput":true,"MIDIConnectionEvent":true,"MIDIAccess":true,"InputDeviceInfo":true,"ImageCapture":true,"ImageBitmapRenderingContext":true,"IIRFilterNode":true,"IDBVersionChangeEvent":true,"IDBTransaction":true,"IDBRequest":true,"IDBOpenDBRequest":true,"IDBObjectStore":true,"IDBKeyRange":true,"IDBIndex":true,"IDBFactory":true,"IDBDatabase":true,"IDBCursorWithValue":true,"IDBCursor":true,"GamepadEvent":true,"Gamepad":true,"GamepadButton":true,"GainNode":true,"EventSource":true,"DynamicsCompressorNode":true,"DeviceOrientationEvent":true,"DeviceMotionEvent":true,"DelayNode":true,"DOMError":true,"CryptoKey":true,"Crypto":true,"ConvolverNode":true,"ConstantSourceNode":true,"CloseEvent":true,"ChannelSplitterNode":true,"ChannelMergerNode":true,"CanvasRenderingContext2D":true,"CanvasCaptureMediaStreamTrack":true,"BroadcastChannel":true,"BlobEvent":true,"BiquadFilterNode":true,"BeforeInstallPromptEvent":true,"BatteryManager":true,"BaseAudioContext":true,"AudioWorkletNode":true,"AudioScheduledSourceNode":true,"AudioProcessingEvent":true,"AudioParamMap":true,"AudioParam":true,"AudioNode":true,"AudioListener":true,"AudioDestinationNode":true,"AudioContext":true,"AudioBufferSourceNode":true,"AudioBuffer":true,"AnalyserNode":true,"postMessage":true,"blur":true,"focus":true,"close":true,"XPathResult":true,"XPathExpression":true,"XPathEvaluator":true,"XMLSerializer":true,"XMLHttpRequestUpload":true,"XMLHttpRequestEventTarget":true,"XMLHttpRequest":true,"XMLDocument":true,"Window":true,"WheelEvent":true,"VisualViewport":true,"ValidityState":true,"VTTCue":true,"URLSearchParams":true,"URL":true,"UIEvent":true,"TreeWalker":true,"TransitionEvent":true,"TrackEvent":true,"TouchList":true,"TouchEvent":true,"Touch":true,"TimeRanges":true,"TextTrackList":true,"TextTrackCueList":true,"TextTrackCue":true,"TextTrack":true,"TextMetrics":true,"TextEvent":true,"Text":true,"TaskAttributionTiming":true,"StyleSheetList":true,"StyleSheet":true,"StylePropertyMapReadOnly":true,"StylePropertyMap":true,"StaticRange":true,"ShadowRoot":true,"Selection":true,"SecurityPolicyViolationEvent":true,"Screen":true,"SVGViewElement":true,"SVGUseElement":true,"SVGUnitTypes":true,"SVGTransformList":true,"SVGTransform":true,"SVGTitleElement":true,"SVGTextPositioningElement":true,"SVGTextPathElement":true,"SVGTextElement":true,"SVGTextContentElement":true,"SVGTSpanElement":true,"SVGSymbolElement":true,"SVGSwitchElement":true,"SVGStyleElement":true,"SVGStringList":true,"SVGStopElement":true,"SVGSetElement":true,"SVGScriptElement":true,"SVGSVGElement":true,"SVGRectElement":true,"SVGRect":true,"SVGRadialGradientElement":true,"SVGPreserveAspectRatio":true,"SVGPolylineElement":true,"SVGPolygonElement":true,"SVGPointList":true,"SVGPoint":true,"SVGPatternElement":true,"SVGPathElement":true,"SVGNumberList":true,"SVGNumber":true,"SVGMetadataElement":true,"SVGMatrix":true,"SVGMaskElement":true,"SVGMarkerElement":true,"SVGLinearGradientElement":true,"SVGLineElement":true,"SVGLengthList":true,"SVGLength":true,"SVGImageElement":true,"SVGGraphicsElement":true,"SVGGradientElement":true,"SVGGeometryElement":true,"SVGGElement":true,"SVGForeignObjectElement":true,"SVGFilterElement":true,"SVGFETurbulenceElement":true,"SVGFETileElement":true,"SVGFESpotLightElement":true,"SVGFESpecularLightingElement":true,"SVGFEPointLightElement":true,"SVGFEOffsetElement":true,"SVGFEMorphologyElement":true,"SVGFEMergeNodeElement":true,"SVGFEMergeElement":true,"SVGFEImageElement":true,"SVGFEGaussianBlurElement":true,"SVGFEFuncRElement":true,"SVGFEFuncGElement":true,"SVGFEFuncBElement":true,"SVGFEFuncAElement":true,"SVGFEFloodElement":true,"SVGFEDropShadowElement":true,"SVGFEDistantLightElement":true,"SVGFEDisplacementMapElement":true,"SVGFEDiffuseLightingElement":true,"SVGFEConvolveMatrixElement":true,"SVGFECompositeElement":true,"SVGFEComponentTransferElement":true,"SVGFEColorMatrixElement":true,"SVGFEBlendElement":true,"SVGEllipseElement":true,"SVGElement":true,"SVGDescElement":true,"SVGDefsElement":true,"SVGComponentTransferFunctionElement":true,"SVGClipPathElement":true,"SVGCircleElement":true,"SVGAnimatedTransformList":true,"SVGAnimatedString":true,"SVGAnimatedRect":true,"SVGAnimatedPreserveAspectRatio":true,"SVGAnimatedNumberList":true,"SVGAnimatedNumber":true,"SVGAnimatedLengthList":true,"SVGAnimatedLength":true,"SVGAnimatedInteger":true,"SVGAnimatedEnumeration":true,"SVGAnimatedBoolean":true,"SVGAnimatedAngle":true,"SVGAnimateTransformElement":true,"SVGAnimateMotionElement":true,"SVGAnimateElement":true,"SVGAngle":true,"SVGAElement":true,"Response":true,"ResizeObserverEntry":true,"ResizeObserver":true,"Request":true,"Range":true,"RadioNodeList":true,"PromiseRejectionEvent":true,"ProgressEvent":true,"ProcessingInstruction":true,"PopStateEvent":true,"PointerEvent":true,"PerformanceTiming":true,"PerformanceServerTiming":true,"PerformanceResourceTiming":true,"PerformancePaintTiming":true,"PerformanceObserverEntryList":true,"PerformanceObserver":true,"PerformanceNavigation":true,"PerformanceMeasure":true,"PerformanceMark":true,"PerformanceLongTaskTiming":true,"PerformanceEntry":true,"Performance":true,"PageTransitionEvent":true,"NodeList":true,"NodeIterator":true,"NodeFilter":true,"Node":true,"Navigator":true,"NamedNodeMap":true,"MutationRecord":true,"MutationObserver":true,"MutationEvent":true,"MouseEvent":true,"MessagePort":true,"MessageEvent":true,"MessageChannel":true,"MediaQueryListEvent":true,"MediaQueryList":true,"MediaList":true,"MediaError":true,"Location":true,"KeyboardEvent":true,"IntersectionObserverEntry":true,"IntersectionObserver":true,"InputEvent":true,"InputDeviceCapabilities":true,"ImageData":true,"ImageBitmap":true,"IdleDeadline":true,"History":true,"Headers":true,"HashChangeEvent":true,"HTMLVideoElement":true,"HTMLUnknownElement":true,"HTMLUListElement":true,"HTMLTrackElement":true,"HTMLTitleElement":true,"HTMLTimeElement":true,"HTMLTextAreaElement":true,"HTMLTemplateElement":true,"HTMLTableSectionElement":true,"HTMLTableRowElement":true,"HTMLTableElement":true,"HTMLTableColElement":true,"HTMLTableCellElement":true,"HTMLTableCaptionElement":true,"HTMLStyleElement":true,"HTMLSpanElement":true,"HTMLSourceElement":true,"HTMLSlotElement":true,"HTMLShadowElement":true,"HTMLSelectElement":true,"HTMLScriptElement":true,"HTMLQuoteElement":true,"HTMLProgressElement":true,"HTMLPreElement":true,"HTMLPictureElement":true,"HTMLParamElement":true,"HTMLParagraphElement":true,"HTMLOutputElement":true,"HTMLOptionsCollection":true,"Option":true,"HTMLOptionElement":true,"HTMLOptGroupElement":true,"HTMLObjectElement":true,"HTMLOListElement":true,"HTMLModElement":true,"HTMLMeterElement":true,"HTMLMetaElement":true,"HTMLMenuElement":true,"HTMLMediaElement":true,"HTMLMarqueeElement":true,"HTMLMapElement":true,"HTMLLinkElement":true,"HTMLLegendElement":true,"HTMLLabelElement":true,"HTMLLIElement":true,"HTMLInputElement":true,"Image":true,"HTMLImageElement":true,"HTMLIFrameElement":true,"HTMLHtmlElement":true,"HTMLHeadingElement":true,"HTMLHeadElement":true,"HTMLHRElement":true,"HTMLFrameSetElement":true,"HTMLFrameElement":true,"HTMLFormElement":true,"HTMLFormControlsCollection":true,"HTMLFontElement":true,"HTMLFieldSetElement":true,"HTMLEmbedElement":true,"HTMLElement":true,"HTMLDocument":true,"HTMLDivElement":true,"HTMLDirectoryElement":true,"HTMLDialogElement":true,"HTMLDetailsElement":true,"HTMLDataListElement":true,"HTMLDataElement":true,"HTMLDListElement":true,"HTMLContentElement":true,"HTMLCollection":true,"HTMLCanvasElement":true,"HTMLButtonElement":true,"HTMLBodyElement":true,"HTMLBaseElement":true,"HTMLBRElement":true,"Audio":true,"HTMLAudioElement":true,"HTMLAreaElement":true,"HTMLAnchorElement":true,"HTMLAllCollection":true,"FormData":true,"FontFaceSetLoadEvent":true,"FocusEvent":true,"FileReader":true,"FileList":true,"File":true,"EventTarget":true,"Event":true,"ErrorEvent":true,"Element":true,"DragEvent":true,"DocumentType":true,"DocumentFragment":true,"Document":true,"DataTransferItemList":true,"DataTransferItem":true,"DataTransfer":true,"DOMTokenList":true,"DOMStringMap":true,"DOMStringList":true,"DOMRectReadOnly":true,"DOMRectList":true,"DOMRect":true,"DOMQuad":true,"DOMPointReadOnly":true,"DOMPoint":true,"DOMParser":true,"DOMMatrixReadOnly":true,"DOMMatrix":true,"DOMImplementation":true,"DOMException":true,"CustomEvent":true,"CustomElementRegistry":true,"CompositionEvent":true,"Comment":true,"ClipboardEvent":true,"CharacterData":true,"CSSVariableReferenceValue":true,"CSSUnparsedValue":true,"CSSUnitValue":true,"CSSTranslate":true,"CSSTransformValue":true,"CSSTransformComponent":true,"CSSSupportsRule":true,"CSSStyleValue":true,"CSSStyleSheet":true,"CSSStyleRule":true,"CSSStyleDeclaration":true,"CSSSkewY":true,"CSSSkewX":true,"CSSSkew":true,"CSSScale":true,"CSSRuleList":true,"CSSRule":true,"CSSRotate":true,"CSSPositionValue":true,"CSSPerspective":true,"CSSPageRule":true,"CSSNumericValue":true,"CSSNumericArray":true,"CSSNamespaceRule":true,"CSSMediaRule":true,"CSSMatrixComponent":true,"CSSMathValue":true,"CSSMathSum":true,"CSSMathProduct":true,"CSSMathNegate":true,"CSSMathMin":true,"CSSMathMax":true,"CSSMathInvert":true,"CSSKeywordValue":true,"CSSKeyframesRule":true,"CSSKeyframeRule":true,"CSSImportRule":true,"CSSImageValue":true,"CSSGroupingRule":true,"CSSFontFaceRule":true,"CSS":true,"CSSConditionRule":true,"CDATASection":true,"Blob":true,"BeforeUnloadEvent":true,"BarProp":true,"Attr":true,"AnimationEvent":true,"AbortSignal":true,"AbortController":true,"WebKitCSSMatrix":true,"WebKitMutationObserver":true,"webkitURL":true,"WebKitAnimationEvent":true,"WebKitTransitionEvent":true,"parent":true,"opener":true,"top":true,"length":true,"frames":true,"closed":true,"location":true,"self":true,"window":true,"document":true,"origin":true,"name":true,"history":true,"locationbar":true,"menubar":true,"personalbar":true,"scrollbars":true,"statusbar":true,"toolbar":true,"status":true,"frameElement":true,"navigator":true,"customElements":true,"external":true,"screen":true,"innerWidth":true,"innerHeight":true,"scrollX":true,"pageXOffset":true,"scrollY":true,"pageYOffset":true,"visualViewport":true,"screenX":true,"screenY":true,"outerWidth":true,"outerHeight":true,"devicePixelRatio":true,"clientInformation":true,"event":true,"offscreenBuffering":true,"screenLeft":true,"screenTop":true,"defaultStatus":true,"defaultstatus":true,"styleMedia":true,"onanimationend":true,"onanimationiteration":true,"onanimationstart":true,"onsearch":true,"ontransitionend":true,"onwebkitanimationend":true,"onwebkitanimationiteration":true,"onwebkitanimationstart":true,"onwebkittransitionend":true,"isSecureContext":true,"onabort":true,"onblur":true,"oncancel":true,"oncanplay":true,"oncanplaythrough":true,"onchange":true,"onclick":true,"onclose":true,"oncontextmenu":true,"oncuechange":true,"ondblclick":true,"ondrag":true,"ondragend":true,"ondragenter":true,"ondragleave":true,"ondragover":true,"ondragstart":true,"ondrop":true,"ondurationchange":true,"onemptied":true,"onended":true,"onerror":true,"onfocus":true,"oninput":true,"oninvalid":true,"onkeydown":true,"onkeypress":true,"onkeyup":true,"onload":true,"onloadeddata":true,"onloadedmetadata":true,"onloadstart":true,"onmousedown":true,"onmouseenter":true,"onmouseleave":true,"onmousemove":true,"onmouseout":true,"onmouseover":true,"onmouseup":true,"onmousewheel":true,"onpause":true,"onplay":true,"onplaying":true,"onprogress":true,"onratechange":true,"onreset":true,"onresize":true,"onscroll":true,"onseeked":true,"onseeking":true,"onselect":true,"onstalled":true,"onsubmit":true,"onsuspend":true,"ontimeupdate":true,"ontoggle":true,"onvolumechange":true,"onwaiting":true,"onwheel":true,"onauxclick":true,"ongotpointercapture":true,"onlostpointercapture":true,"onpointerdown":true,"onpointermove":true,"onpointerup":true,"onpointercancel":true,"onpointerover":true,"onpointerout":true,"onpointerenter":true,"onpointerleave":true,"onafterprint":true,"onbeforeprint":true,"onbeforeunload":true,"onhashchange":true,"onlanguagechange":true,"onmessage":true,"onmessageerror":true,"onoffline":true,"ononline":true,"onpagehide":true,"onpageshow":true,"onpopstate":true,"onrejectionhandled":true,"onstorage":true,"onunhandledrejection":true,"onunload":true,"performance":true,"stop":true,"open":true,"alert":true,"confirm":true,"prompt":true,"print":true,"requestAnimationFrame":true,"cancelAnimationFrame":true,"requestIdleCallback":true,"cancelIdleCallback":true,"captureEvents":true,"releaseEvents":true,"getComputedStyle":true,"matchMedia":true,"moveTo":true,"moveBy":true,"resizeTo":true,"resizeBy":true,"getSelection":true,"find":true,"webkitRequestAnimationFrame":true,"webkitCancelAnimationFrame":true,"fetch":true,"btoa":true,"atob":true,"setTimeout":true,"clearTimeout":true,"setInterval":true,"clearInterval":true,"createImageBitmap":true,"scroll":true,"scrollTo":true,"scrollBy":true,"onappinstalled":true,"onbeforeinstallprompt":true,"crypto":true,"ondevicemotion":true,"ondeviceorientation":true,"ondeviceorientationabsolute":true,"indexedDB":true,"webkitStorageInfo":true,"sessionStorage":true,"localStorage":true,"SharedArrayBuffer":true,"Atomics":true,"BigInt":true,"chrome":true,"WebAssembly":true,"nw":true,"Mojo":true,"MojoHandle":true,"MojoWatcher":true,"MediaCapabilitiesInfo":true,"OffscreenCanvas":true,"PerformanceNavigationTiming":true,"ReportingObserver":true,"SVGAnimationElement":true,"SVGDiscardElement":true,"SVGMPathElement":true,"SharedWorker":true,"FontFace":true,"Worker":true,"XSLTProcessor":true,"GamepadHapticActuator":true,"Notification":true,"OffscreenCanvasRenderingContext2D":true,"PaymentInstruments":true,"PaymentManager":true,"PaymentRequestUpdateEvent":true,"Permissions":true,"PermissionStatus":true,"EnterPictureInPictureEvent":true,"PictureInPictureWindow":true,"Presentation":true,"PresentationAvailability":true,"PresentationConnection":true,"PresentationConnectionAvailableEvent":true,"PresentationConnectionCloseEvent":true,"PresentationConnectionList":true,"PresentationReceiver":true,"PresentationRequest":true,"PushManager":true,"PushSubscription":true,"PushSubscriptionOptions":true,"RemotePlayback":true,"SpeechSynthesisEvent":true,"SpeechSynthesisUtterance":true,"webkitSpeechGrammar":true,"webkitSpeechGrammarList":true,"webkitSpeechRecognition":true,"webkitSpeechRecognitionError":true,"webkitSpeechRecognitionEvent":true,"CanvasGradient":true,"CanvasPattern":true,"Path2D":true,"WebGL2RenderingContext":true,"WebGLActiveInfo":true,"WebGLBuffer":true,"WebGLFramebuffer":true,"WebGLProgram":true,"WebGLQuery":true,"WebGLRenderbuffer":true,"WebGLRenderingContext":true,"WebGLSampler":true,"WebGLShader":true,"WebGLShaderPrecisionFormat":true,"WebGLSync":true,"WebGLTexture":true,"WebGLTransformFeedback":true,"WebGLUniformLocation":true,"WebGLVertexArrayObject":true,"BluetoothUUID":true,"speechSynthesis":true,"webkitRequestFileSystem":true,"webkitResolveLocalFileSystemURL":true,"openDatabase":true,"applicationCache":true,"Worklet":true,"ApplicationCache":true,"ApplicationCacheErrorEvent":true,"caches":true,"AudioWorklet":true,"Cache":true,"CacheStorage":true,"Clipboard":true,"Credential":true,"CredentialsContainer":true,"FederatedCredential":true,"Keyboard":true,"MediaKeyMessageEvent":true,"MediaKeys":true,"MediaKeySession":true,"MediaKeyStatusMap":true,"MediaKeySystemAccess":true,"NavigationPreloadManager":true,"PasswordCredential":true,"ServiceWorker":true,"ServiceWorkerContainer":true,"ServiceWorkerRegistration":true,"StorageManager":true,"KeyboardLayoutMap":true,"PaymentAddress":true,"PaymentRequest":true,"PaymentResponse":true,"AbsoluteOrientationSensor":true,"Accelerometer":true,"Gyroscope":true,"LinearAccelerationSensor":true,"OrientationSensor":true,"RelativeOrientationSensor":true,"Sensor":true,"SensorErrorEvent":true,"AuthenticatorAssertionResponse":true,"AuthenticatorAttestationResponse":true,"AuthenticatorResponse":true,"PublicKeyCredential":true,"Bluetooth":true,"BluetoothCharacteristicProperties":true,"BluetoothDevice":true,"BluetoothRemoteGATTCharacteristic":true,"BluetoothRemoteGATTDescriptor":true,"BluetoothRemoteGATTServer":true,"BluetoothRemoteGATTService":true,"Lock":true,"LockManager":true,"USB":true,"USBAlternateInterface":true,"USBConfiguration":true,"USBConnectionEvent":true,"USBDevice":true,"USBEndpoint":true,"USBInterface":true,"USBInTransferResult":true,"USBIsochronousInTransferPacket":true,"USBIsochronousInTransferResult":true,"USBIsochronousOutTransferPacket":true,"USBIsochronousOutTransferResult":true,"USBOutTransferResult":true,"require":true,"process":true,"Buffer":true,"global":true,"AppView":true,"ExtensionOptions":true,"ExtensionView":true,"WebView":true,"a":true,"dir":true,"dirxml":true,"profile":true,"profileEnd":true,"clear":true,"table":true,"keys":true,"values":true,"debug":true,"undebug":true,"monitor":true,"unmonitor":true,"inspect":true,"copy":true,"queryObjects":true,"$_":true,"$0":true,"$1":true,"$2":true,"$3":true,"$4":true,"getEventListeners":true,"monitorEvents":true,"unmonitorEvents":true,"$":true,"$$":true,"$x":true,"TEMPORARY":true,"PERSISTENT":true,"constructor":true,"addEventListener":true,"removeEventListener":true,"dispatchEvent":true,"__defineGetter__":true,"__defineSetter__":true,"hasOwnProperty":true,"__lookupGetter__":true,"__lookupSetter__":true,"isPrototypeOf":true,"propertyIsEnumerable":true,"toString":true,"valueOf":true,"toLocaleString":true}

const GAME_PROPERTY_NAMES = Object.getAllOwnPropertyNames( window ).filter( name => !WINDOW_DEFAULT_PROPERTY_NAMES[name] );


/* File source: ../src/Ambitious_Dwarf///src/engine/loader.js */
class GameLoader{
    constructor( buildPath = "./build", fileFormat = /\d+_\w+.js/){
        this.buildPath = "./build";

        var fs = require("fs");
        this.loadOrder = fs.readdirSync( buildPath ).filter( (dir)=>{
            // Pull out the files with the right name format
            var a = fileFormat.test( dir );
            return a;
        }, this).sort( (a,b)=>{
            // Sort them into the appropriate load order
            return parseInt( b.split("_")[0] ) - parseInt( a.split("_")[0] );
        });
        this.loadNext();
    }

    loadNext(){
        var fileName = this.loadOrder.pop(), self = this;
        var scriptElement = document.createElement("script");
        console.log(`Loading module ${ fileName }`);
        scriptElement.src = `${ this.buildPath }/${ fileName }`;
        scriptElement.onload = function(){
            if( self.loadOrder.length !=0 ){
                self.loadNext();
            }
        }
        document.body.appendChild( scriptElement );
    }
}

const GL = new GameLoader();

