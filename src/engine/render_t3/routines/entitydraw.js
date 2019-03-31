	/**
	 * Drawroutine for entities
	 */
TileViewContext.t3_entityDrawRoutine = function(){
    if(!cfg.t3_routineEnable_drawEntity) return;
    TileViewContext.clearViewspace( TSINTERFACE.CVSCTX.entities );
    var ctx = TSINTERFACE.CVSCTX.entities;

    var chunkRange = TSINTERFACE.viewContext.chunkViewRange.add( TSINTERFACE.placeholders.chunkExtendVector );
    /*
        Checks if entity is within view range (chunk-wise), renders if so.
    */


    TSINTERFACE.World.entities.map( ( entity )=>{
        if(chunkRange.includes( entity.chunk.position )){
            var region = entity.sprite.lastDrawRegion;
            if(cfg.render_dynamic_only){
                // Clear the region the entity was at and fill it back with the frame
                TSINTERFACE.CVSCTX.rendering.clearRect( ...entity.sprite.lastDrawRegion.values );
                TSINTERFACE.CVSCTX.rendering.drawImage( TSINTERFACE.canvases.frame, ...region.values, ...region.values );
            }
            TSINTERFACE.viewContext.t3_renderEntity( entity );

            // Draw bounding box of entity
            if(cfg.debug_show_entity_drawRegion){
                var dr = entity.sprite.lastDrawRegion;
                ctx.strokeStyle = entity.sprite.actionColor;
                ctx.beginPath();
                ctx.rect( ...dr.values );
                ctx.stroke();
            }
        }
    });

}