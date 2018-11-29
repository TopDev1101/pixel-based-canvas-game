class TileSpriteBush extends TileSprite{
    constructor( tile ){
        super( tile );
        this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
        this.source = Townsend.spritesheet.plants1;
        this.staticSpriteLocation = this.source.getTileAt( 0, 0 );
        this.staticGroundLocation = Townsend.spritesheet.grounds.getTileAt(0,3);
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
    }

    t3_draw( chunk, pCoordVect ){
        var randomSprite = Math.floor(Math.random()* 3),    
            randomSpriteLocation = this.source.getTileAt( this.bushSpriteIndex, randomSprite );
        
        this.t3_drawGround( chunk, pCoordVect );
        TileSprite.drawLayeredTile( this.source, chunk, randomSpriteLocation, this.spritePixelOffset, this.spritePixelOverflowOffset, pCoordVect );
    }
}