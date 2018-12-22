TileViewContext.t3_chunkDrawRoutine = function(){
    if(!cfg.t3_routineEnable_drawChunk) return;
    TileViewContext.clearViewspace( TSINTERFACE.CVSCTX.ground );
    TileViewContext.clearViewspace( TSINTERFACE.CVSCTX.overflow );

    var chunkRange = TSINTERFACE.viewContext.chunkViewRange,
        chunk = null;

    // Reset chunk cache and redraw if the frame was moved
    if(TSINTERFACE.VC.frameMoved){
        TSINTERFACE.VC.chunkcache = [];
        nestedIncriment([0,0], [chunkRange.z, chunkRange.a], (x, y) => {
            var relX = x + chunkRange.x,
                relY = y + chunkRange.y;
            chunk = TSINTERFACE.World.getChunk( relX, relY );
            if( chunk ){
                chunk.renderer.t3_drawProtocol();
                TSINTERFACE.viewContext.t3_renderChunk( chunk, relX, relY );
                TSINTERFACE.VC.chunkcache.push( {chunk:chunk, relX:relX, relY:relY} );
            }
        });
    }else{
        TSINTERFACE.VC.chunkcache.map( (chunkPayload)=>{
            chunkPayload.chunk.renderer.t3_drawProtocol();
            TSINTERFACE.viewContext.t3_renderChunk( chunkPayload.chunk, chunkPayload.relX, chunkPayload.relY );
        });
    }
    
    // Memory safety
    TSINTERFACE.safety.heapWatch();

    // Async load chunks
    if(cfg.debug_chunk_backgroundload_disable){ return; }
    if(TSINTERFACE.World.chunkNeedsPrerender.length==0){
        TSINTERFACE.VC.doFrameSkips = false;
        return;
    }else{
        TSINTERFACE.VC.doFrameSkips = cfg.render_enable_frame_skip; 
    }
    chunk = TSINTERFACE.World.chunkNeedsPrerender.pop();
    if(!chunk.renderer.firstRenderDone){
        chunk.renderer.t3_drawProtocol();
    }

}