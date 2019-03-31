/**
 * Creates a single composited scene from consitutes
 * (10-20fps performance increase)
 */
TileViewContext.t3_mergeDrawRoutine = function(){
    if(!cfg.t3_routineEnable_composite) return;
    if( cfg.render_dynamic_only ){
        // Routine for dynamic-sprite-only rendering 
        // 30% slower on 2x2 map with 100 entities
        // 10-20 fps faster on 20x20 map with 10 entities
        if(TSINTERFACE.VC.frameNeedsUpdate){
            // If the view frame is moved, redraw the entire scene
            TileViewContext.clearViewspace( TSINTERFACE.CVSCTX.rendering );
            TSINTERFACE.CVSCTX.rendering.drawImage( TSINTERFACE.canvases.frame, 0, 0 );
            TSINTERFACE.CVSCTX.rendering.drawImage( TSINTERFACE.canvases.entities, 0, 0 );
            TSINTERFACE.VC.frameNeedsUpdate = false;
        }else{
            // If the viewframe is stationary, redraw entities
            TSINTERFACE.CVSCTX.rendering.drawImage( TSINTERFACE.canvases.entities, 0, 0 );
        }
    }else{	// Routine for full scene rendering
        TileViewContext.clearViewspace( TSINTERFACE.CVSCTX.rendering );
        TSINTERFACE.CVSCTX.rendering.drawImage( TSINTERFACE.canvases.frame, 0, 0 );
        TSINTERFACE.CVSCTX.rendering.drawImage( TSINTERFACE.canvases.entities, 0, 0 );
    }
    
    if( cursorBox.show ){
        let diff = cursorBox.start.subtract( cursorBox.end ).scale(-1),
            ctx = TSINTERFACE.CVSCTX.rendering;
        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle="red";
        ctx.rect( ...cursorBox.start.values, ...diff.values );
        ctx.stroke();
    }
}