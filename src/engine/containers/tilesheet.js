/**
 * Tilesheets, spritesheets, whatever. They're the same thing and they should have been named the same thing.
 */
class Tilesheet{
	/**
	 * Creates a new spritesheet
	 * @param {HTMLImageElement/HTMLCanvasElement} _Source 
	 * @param {Number} unitSize Unit size of a tile
	 * @param {Callback} onload Called once the source is loaded
	 */
	constructor( _Source, unitSize, onload = ()=>{} ){
		this.source = _Source;
		var self = this;
		_Source.onload = (...args)=>{
			onload(...args);
			self.rows = _Source.height / unitSize;
			self.cols = _Source.width / unitSize;
		};
		this.tileLocations = {};		// Locations which tiles are stored within the tile sheet
		this.unitSize = unitSize || 1; // Tile unit size in pixels
		this.managerindex = 0;
	}
	
	/**
	 * Allows tiles to be looked up with a key-pair instead of hard coding tile locations
	 * Row major
	 * @param {String} identifier 
	 * @param {CoordinateVector} _TileLocation Tilesheet relative coordinates
	 */
	addTile( identifier, _TileLocation ){
		var uSize = this.unitSize;
		var h = _TileLocation.y;
		_TileLocation.y = _TileLocation.x;
		_TileLocation.x = h;
		_TileLocation = _TileLocation.scale( uSize );
		this.tileLocations[ identifier ] = _TileLocation;
	}
	
	/**
	 * Allows tiles to be looked up with a key-pair instead of hard coding tile locations
	 * @param {String} identifier 
	 * @returns {TileLocation}
	 */
	getTile( identifier ){
		return this.tileLocations[identifier];
	}
	
	/**
	 * Produces a vector of the upper left pixel position of a tile, based on the unit row and column
	 * @param {*} row 
	 * @param {*} col
	 * @returns {CoordinateVector}
	 */
	getTileAt( row, col ){
		var self = this;
		return new Vector( col, row ).scale( self.unitSize );
	}
	
	/**
	 * Draws a full tile
	 * @param {HTMLCanvasContext} _HTMLCanvasContext 
	 * @param {CoordinateVector} _Vector$start The upper left pixel position of the tile
	 * @param {CoordinateVector} _Vector$dest 
	 * @param {Number} width 
	 * @param {Number} height 
	 */
	drawTile( _HTMLCanvasContext, _Vector$start, _Vector$dest, width, height ){
		this.drawPartialTile( _HTMLCanvasContext, _Vector$start, this.unitSize, this.unitSize, _Vector$dest, width, height );
	}

	/**
	 * Draws part of a tile
	 * @param {HTMLCanvasContext} _HTMLCanvasContext 
	 * @param {CoordinateVector} _Vector$start 
	 * @param {Number} unitSizeW 
	 * @param {Number} unitSizeH 
	 * @param {CoordinateVector} _Vector$dest 
	 * @param {Number} width 
	 * @param {Number} height 
	 */
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