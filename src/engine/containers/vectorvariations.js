/**
 * Coordinate vectors are used to denote coordinates, but will accept vector operations
 */
class CoordinateVector extends Vector{
    constructor( ...args ){
        super(...args);
        this.variation = CoordinateVector;
    }
}

/**
 * Defines a region
 */
class Rectangle extends Vector{
	constructor(...args){
        super(...args);
        this.variation = Rectangle;
    }
    
    get width(){
        return this.z;
    }

    set width(x){
        this.z = x;
    }

    get height(){
        return this.a;
    }

    set height(n){
        this.a = n;
    }

	includes( v ){
		return Math.isInRange( v.x, this.x, this.x+this.z ) && Math.isInRange( v.y, this.y, this.y+this.a );
	}
}