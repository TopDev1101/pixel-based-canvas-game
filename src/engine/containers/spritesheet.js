/**
 * Distinction between spritesheet and tilesheet? tilesheet should have been called something else.
 */
class Spritesheet extends Tilesheet{
	/**
	 * Creates a new spritesheet
	 * @param {HTMLImageElement/HTMLCanvasElement} _Source 
	 * @param {Number} unitSize Unit size of a tile
	 * @param {Callback} onload Called once the source is loaded
	 */
	constructor( _Source, unitSize, onload ){
		super( _Source, unitSize, onload );
	}
	
	/**
	 * Produces a vector of the upper left pixel position of a tile, based on the unit row and column
	 * @param {*} row 
	 * @param {*} col 
	 */
	getSpriteAt( ...args ){
		return this.getTileAt( ...args );
	}

	/**
	 * Draws part of a sprite
	 * @param {HTMLCanvasContext} _HTMLCanvasContext 
	 * @param {CoordinateVector} _Vector$start 
	 * @param {Number} unitSizeW 
	 * @param {Number} unitSizeH 
	 * @param {CoordinateVector} _Vector$dest 
	 * @param {Number} width 
	 * @param {Number} height 
	 */
	drawPartialSprite( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height ){
		this.drawPartialTile( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height );
	}

	/**
	 * Use the index of the sprite which gets mapped into tile coordinates
	 * @param {Number} index Index of the sprite
	 */
	getSpriteAtIndex( index ){
		return this.getSpriteAt( Math.floor( index / this.rows ), index % cols );
	}
}