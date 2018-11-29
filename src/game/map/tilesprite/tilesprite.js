/**
 * Simple tiles
 */
class TileSprite extends PrerenderableSprite{
	constructor( tile, tileSpriteSource = Townsend.spritesheet.placeholders, tileSpriteKey = new Vector(0,0) ){
		super();
		this.tile = tile;
		this.width = cfg.tile_size;
		this.height = cfg.tile_size;
		
		// Sprite source and the key to the sprite if the sprite is static
		this.source = tileSpriteSource;
		this.sourceKey = tileSpriteKey;

		this.defaultStaticGroundLocation = Townsend.spritesheet.grounds.getTileAt(0,0);
		// Other stuff
		this.staticSpriteLocation = this.source.getSpriteAt( 1, 0 );
		this.staticGroundSource = Townsend.spritesheet.grounds;
		this.staticGroundLocation = this.defaultStaticGroundLocation;
		this.spritePixelOffset = new Vector( 0,2 );	// The offset of a sprite
		this.spritePixelOverflowOffset = this.calculateOverflowOffset(); // This is what Chunk.canvasOverflow is for
	}

	calculateOverflowOffset(){
        return new Vector( 0, cfg.tile_size - this.spritePixelOffset.y );
    }

	t3_prerender( chunk, coordVect, globalTileCoordVect ){

	}

	/**
	 * Draws an icon for the tilesprite
	 * Used within gui
	 * @param {HTMLCanvas2dContext} canvasCtx 
	 */
	draw_icon( canvasCtx ){
		this.source.drawTile(
			canvasCtx,
			this.sourceKey,
			new Vector(0,0),
			28, 28
		);
	}

	/**
	 * Memory efficent drawRoutine<br>
	 * Thought: Instead of creating a TileSprite instance for each instance of a tile,
	 * 			Why not create one one TileSprite instance that will be used by the same tile?<br>
	 *			<img src="https://i.imgur.com/EUCHdNr.png" width="100px"><br>
	 * Implementations of t4 assumes 2 things:<br>
	 * 		1) the tilesprite is defined in a global scope<br>
	 * 		2) tiledata will derrive from the tile passed through the function
	 * @param {Tile} tile 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} tCoordVect Chunk relative tile coordinates
	 * @param {CoordinateVector} gtCoordVect Global tile coordinates
	 */
	t4_drawRoutine( tile, chunk, tCoordVect, gtCoordVect ){
		return;
	}

	/**
	 * 
	 * @param {*} chunk 
	 * @param {*} coordVect 
	 * @param {*} globalTileCoordVect 
	 */
	t3_drawRoutine( chunk, coordVect, globalTileCoordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.t3_clearRenderingSpace(chunk, coordVect);

		if( this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready ){
			this.t3_prerender( chunk, pCoordVect, globalTileCoordVect );
		}
		this.t3_draw( chunk, pCoordVect, globalTileCoordVect );
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
		this.staticGroundSource.drawTile(
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