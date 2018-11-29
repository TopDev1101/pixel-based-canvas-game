/**
 * Tile locations are structs that tell you the space a tile occupies on a tilesheet
 */
class TileLocation{
	/**
	 * Creates a new tileLocation
	 * @param {CoordinateVector} _Vector$start The upper left position of the sprite
	 * @param {Vector} _Vector$size The size of the sprite
	 */
	constructor( _Vector$start, _Vector$size ){
		this.start = _Vector$start;
		this.size = _Vector$size ? _Vector$size : new Vector( 1, 1 );
	}
}

var createSource = {
	/**
	 * Creates an image source
	 * @param {String} srcPath Path of the image
	 * @param {Function{}} events HTMLElementEvent handlers 
	 */
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

/**
 * Unused
 */
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