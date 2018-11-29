class PineTreeTile extends TreeTile{
    constructor(){
        super();
        this.prerenderIdentities=["default", "hovered"];
        this.needsPrerender = true;
        this.prerenderHeight = cfg.tile_size+cfg.tile_size/2;
        this.addIdentity("pine");

        this.source = Townsend.spritesheet.DFDefault;
        this.staticSpriteLocation = this.source.getTileAt( 1, 7 );
    }

    
    t3_draw( chunk, coordVect ){
        Townsend.spritesheet.grass.drawTile(
			chunk.renderer.canvasCtx,
			Townsend.spritesheet.grass.getTileAt( 2, 7 ),
			coordVect,
			cfg.tile_size, cfg.tile_size
		);
		Townsend.spritesheet.DFDefault.drawTile(
			chunk.renderer.canvasOverflowCtx,
			this.staticSpriteLocation,
			coordVect,
			cfg.tile_size, cfg.tile_size
		);
    }








    /////////////////
    // Depreciated //
    /////////////////
    
	DEPRECIATED_prerender_default( drawPacket, prerenderLocationData ){
        var tilesheet = drawPacket.parent.TS.DFDefault,		// Tilesheet
			routineData = drawPacket.parent,				// Parent data
            viewContext = drawPacket.viewContext,			// Draw Data
            pld = prerenderLocationData,    // Shorthand
            self = this,
            groundSpriteLocation = tilesheet.getTileAt( 2, 7 ),
            treeSpriteLocation = this.getTileSpriteLocation( tilesheet );
        
        // Draw ground
        tilesheet.drawTile(
            routineData.viewContext.renderingManager.contexts.prerendering,
            groundSpriteLocation,
            new Vector( pld.index, pld.height+8 ),
            self.tileSize, self.tileSize
        );

        // Add tree
        tilesheet.drawTile(
            routineData.viewContext.renderingManager.contexts.prerendering,
            treeSpriteLocation,
            new Vector( pld.index, pld.height ),
            self.tileSize, self.tileSize
        );
    }
    
	DEPRECIATED_prerender_hovered( drawPacket, prerenderLocationData ){
        var tilesheet = drawPacket.parent.TS.DFDefault,		// Tilesheet
			routineData = drawPacket.parent,				// Parent data
            viewContext = drawPacket.viewContext,			// Draw Data
            self = this,
            pld = prerenderLocationData,
            groundSpriteLocation = tilesheet.getTileAt( 2, 7 ),
            treeSpriteLocation = this.getTileSpriteLocation( tilesheet ),
            groundTo = new Vector( pid.index, pid.height+8 );

        // Draw ground
        tilesheet.drawTile(
            routineData.viewContext.renderingManager.contexts.prerendering,
            groundSpriteLocation,
            groundTo,
            self.tileSize, self.tileSize
        );

        routineData.viewContext.renderingManager.canvasPipelines.prerendering
			.setFillStyle( [ new Color(200,255,255,0.3).rgbaString ] )
			.beginPath()
			.rect([
				groundTo.x,
				groundTo.y,
                self.tileSize,  self.tileSize])
			.fill();

        // Add tree
        tilesheet.drawTile(
            routineData.viewContext.renderingManager.contexts.prerendering,
            treeSpriteLocation,
            new Vector( pid.index, pid.height ),
            self.tileSize, self.tileSize
        );
	}

    DEPRECIATED_draw( drawPacket ){

    }

    DEPRECIATED_getTileSpriteLocation( tilesheet ){
        return tilesheet.getTileAt(...[1,8]);
    }
}