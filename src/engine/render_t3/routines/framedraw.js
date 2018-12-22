TileViewContext.t3_viewRangeUpdate = function(){
    // Store last view range, update new view range
    TSINTERFACE.VC.lastChunkViewRange = TSINTERFACE.VC.chunkViewRange;
    TSINTERFACE.VC.chunkViewRange = TileScaleHelper.getChunksInViewRange( TSINTERFACE.viewContext );

    // Check to see if the frame was moved, determined by a difference in view ranges
    TSINTERFACE.VC.frameMoved = TSINTERFACE.VC.chunkViewRange.equals( TSINTERFACE.VC.lastChunkViewRange );
}

TileViewContext.t3_frameDrawRoutine = function(){
    if(!cfg.t3_routineEnable_drawFrame) return;
    if(cfg.render_dynamic_only && !TSINTERFACE.VC.frameNeedsUpdate){
        if(TSINTERFACE.VC.frameCounter%1000==0){
            // Randomly force frame to update
            TSINTERFACE.VC.frameNeedsUpdate = true;
        }
        return;
    }else{
        // Clears then compsites 
        TileViewContext.clearViewspace( TSINTERFACE.CVSCTX.frame );
        TSINTERFACE.CVSCTX.frame.drawImage( TSINTERFACE.canvases.ground, 0, 0 );
        TSINTERFACE.CVSCTX.frame.drawImage( TSINTERFACE.canvases.overflow, 0, 0 );
    }
}