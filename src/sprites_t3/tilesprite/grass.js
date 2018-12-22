class TileSpriteGrass extends TileSprite{
	constructor( tile ){
        super( tile );
        this.source = SSGrounds;
		this.spritePixelOffset = new Vector( 0,4 );	// The offset of a sprite
        this.spritePixelOverflowOffset = this.calculateOverflowOffset(); // This is what Chunk.canvasOverflow is for
	}

	t3_draw( chunk, pCoordVect ){
		// Ground Grass tile
		if( Math.random() < 0.05){
			this.staticGroundLocation = this.source.getTileAt(0,1+Math.floor(Math.random()*2));
		}else{
			this.staticGroundLocation = this.defaultStaticGroundLocation;
		}
		this.t3_drawGround( chunk, pCoordVect );

        if(!cfg.render_decals){return;}
		// Decals
		var randomSprite, randomSpriteLocation;
		if( false && Math.random() < 0.05){
			// Big plants
			randomSprite= Math.floor(Math.random()* 6);
			this.staticGroundLocation = TSINTERFACE.spritesheet.grounds.getTileAt(0,4);
            randomSpriteLocation = TSINTERFACE.spritesheet.plants1.getTileAt( 1, randomSprite );
			TileSprite.drawLayeredTile( TSINTERFACE.spritesheet.plants1, chunk, randomSpriteLocation, this.spritePixelOffset, this.spritePixelOverflowOffset, pCoordVect );
		}else{
			// Grass overlays
			randomSprite= Math.floor(Math.random()* 6);
			randomSpriteLocation = TSINTERFACE.spritesheet.plants1.getTileAt( 4, randomSprite );
			TSINTERFACE.spritesheet.plants1.drawTile(
				chunk.renderer.canvasOverflowCtx,
				randomSpriteLocation,
				pCoordVect,
				cfg.tile_size, cfg.tile_size
			);
		}
	}
}
