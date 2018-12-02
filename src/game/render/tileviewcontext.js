class TileViewContext extends ViewContext{
	constructor(){
		super();
		var self = this;
		this.renderingManager = new RenderingManager([
			"rendering",        //
			"frame",
			"lightsOverflow",
			"ambientLight",
			"overflow",  // Rendering parts that go above the entity
			"lights",
			"entities",         // The entity
			"cursor",           // The cursor
			"ground",           // The ground
			"placeholder"
		]);
		this.frameCounter = 0;
		this.needsRedraw = false;
		this.frameCounterLast = 0;
		this.frameTimeLast = new Date().getTime();
		this.visualUpdateInterval = 15;
		this.pixelOffset = new Vector(window.innerWidth/2, window.innerHeight/2);
		this.frameMoved = true;
		this.frameNeedsUpdate = true;
		this.tileSize = cfg.tile_size;
		this.tileScaleHelper = new TileScaleHelper( self );
		this.drawRoutines = {};
		this.cursor = new TiledCursorInteractionContext( self  );
		this.doFrameSkips = false;
		this.animations = {
			zoom:{ timeStart:0, goal:0 }
		}
		this.chunkcache = [];
	}

	get canvas(){
		return this.renderingManager.canvases.default;
	}

	initDrawRoutines(){
		var self = this;
		self.drawRoutines.viewRangeUpdate = new Routine(
			TileViewContext.t3_viewRangeUpdate,
			null, null, 
			()=>{ return TileViewContext.t3_viewRangeUpdate( self ); }
		);
		self.drawRoutines.chunk = new Routine(
			TileViewContext.t3_chunkDrawRoutine,
			null, null, 
			()=>{ return TileViewContext.t3_chunkDrawRoutine( self ); }
		);
		self.drawRoutines.entity = new Routine(
			TileViewContext.t3_entityDrawRoutine,
			null, null, 
			()=>{ return TileViewContext.t3_entityDrawRoutine( self ); }
		);
		self.drawRoutines.merge = new Routine(
			TileViewContext.t3_mergeDrawRoutine,
			null, null, 
			()=>{ return TileViewContext.t3_mergeDrawRoutine( self ); }
		);
		self.drawRoutines.frame = new Routine(
			TileViewContext.t3_frameDrawRoutine,
			null, null, 
			()=>{ return TileViewContext.t3_frameDrawRoutine( self ); }
		);

		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.viewRangeUpdate);
		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.chunk);
		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.frame);
		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.entity);
		this.renderingManager.addRoutine(STR.ID.rendering, self.drawRoutines.merge);
	}
	
	static t3_frameDrawRoutine(  ){
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

	/**
	 * 
	 * @param {HTMLCanvasContext2d} context 
	 */
	static clearViewspace( context ){
		context.clearRect(0,0,window.innerWidth,window.innerHeight);
	}

	static t3_viewRangeUpdate(){
		// Store last view range, update new view range
		TSINTERFACE.VC.lastChunkViewRange = TSINTERFACE.VC.chunkViewRange;
		TSINTERFACE.VC.chunkViewRange = TileScaleHelper.getChunksInViewRange( TSINTERFACE.viewContext );

		// Check to see if the frame was moved, determined by a difference in view ranges
		TSINTERFACE.VC.frameMoved = TSINTERFACE.VC.chunkViewRange.equals( TSINTERFACE.VC.lastChunkViewRange );
	}

	static t3_chunkDrawRoutine(  ){
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

	static t3_entityPlaceholdersDrawRoutine( entity ){
		var placeholderCanvas = entity.sprite.placeholderCanvas;
		TSINTERFACE.CVSCTX.rendering.drawImage( placeholderCanvas, entity.sprite.lastDrawRegion.x, entity.sprite.lastDrawRegion.y );
	}

	/**
	 * Drawroutine for entities
	 */
	static t3_entityDrawRoutine(){
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
				if(cfg.debug_show_entity_drawRegion){
					var dr = entity.sprite.lastDrawRegion;
					ctx.beginPath();
					ctx.rect( ...dr.values );
					ctx.stroke();
				}
			}
		});

	}

	/**
	 * 
	 * @param {Chunk} chunk 
	 * @param {Number} relX Relative X coordinate
	 * @param {Number} relY Relative Y coordinate
	 */
	t3_renderChunk( chunk, relX, relY ){
		// Where the chunk is presented on screen
		var screenX = relX * TSINTERFACE.VCTSH.chunkSize + TSINTERFACE.viewContext.pixelOffset.x;
		var screenY = relY * TSINTERFACE.VCTSH.chunkSize + TSINTERFACE.viewContext.pixelOffset.y;
		TSINTERFACE.CVSCTX.ground.drawImage( chunk.renderer.canvas, screenX, screenY, TSINTERFACE.VCTSH.chunkSize, TSINTERFACE.VCTSH.chunkSize );
		TSINTERFACE.CVSCTX.overflow.drawImage( chunk.renderer.canvasOverflow, screenX, screenY-TSINTERFACE.VCTSH.tileSize, TSINTERFACE.VCTSH.chunkSize, TSINTERFACE.VCTSH.chunkSize );
		if( cfg.debug_show_chunk_region ) this.debugRenderChunkRegion( chunk, screenX, screenY );
	}

	debugRenderChunkRegion( chunk, screenX, screenY ){
		var ctx = TSINTERFACE.CVSCTX.rendering;
		ctx.fillStyle = chunk.renderer.debug_color;
		ctx.fillRect( screenX, screenY, TSINTERFACE.VCTSH.chunkSize, TSINTERFACE.VCTSH.chunkSize );
		ctx.font = `${TSINTERFACE.VCTSH}px`;
		ctx.fillStyle = "white";
		ctx.fillText( JSON.stringify(chunk.position.values), screenX, screenY+20 );
	}

	t3_renderEntity( entity ){
		// Entity already has a method to describe it's absolute pixel position
		// So there's no need for extra data when it comes to rendering the entity
		// Simply globalPixelPosition + viewContext.pixelOffset
		entity.sprite.t3_drawRoutine();
	}

	/**
	 * Creates a single composited scene from consitutes
	 * (10-20fps performance increase)
	 */
	static t3_mergeDrawRoutine(){
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
		
		
	}

	draw(){
		TileViewContext.draw( this );
	}

	static DEPRECIATED_drawRoutineData_tile( self ){
		return {
			ctx: self.renderingManager.contexts.rendering,
			ctxPipeline: self.renderingManager.canvasPipelines.rendering,
			TS: TS, // defined in game/render/spritedefs.js
			viewContext: self,
			world: world, // Defined in game/map/init.js
			mouse: self.cursor
		};
	}

	static draw( self ){
		TileViewContext.updateFPS( self );
		//self.renderingManager.contexts.rendering.globalAlpha = 1;
		//TileViewContext.clearRenderspaces( self, ["overflow","ground"] );
		TileViewContext.render( self );
        TileViewContext.redraw( self );
    }

    static render( self ){
        self.renderingManager.render( STR.ID.rendering );
    }

    static redraw( self ){
		if( self.fps <= 60 && self.frameCounter % cfg.render_frame_skip == 0 && TSINTERFACE.VC.doFrameSkips){
			setTimeout( ()=>{TileViewContext.draw( self ); }, 1000/self.fps );
			return;
		}
        window.requestAnimationFrame( ()=>{TileViewContext.draw( self ); } );
    }

    static updateFPS( self ){
		self.frameCounter++;
        if((new Date().getTime()) - self.frameTimeLast >= 1000){
			self.fps = self.frameCounter - self.frameCounterLast;
			self.frameTimeLast = new Date().getTime();
			self.frameCounterLast = self.frameCounter;
        }
    }

	/*
    static DEPRECIATED_clearRenderspaces( self, renderspaces ){
        self.renderingManager.contexts.rendering.fillStyle = new Color( 0,0,0,0 ).rgbaString;
        self.renderingManager.contexts.rendering.clearRect( 0,0,window.innerWidth,window.innerHeight );
	}
	




	static DEPRECIATED_drawRoutine_tile( routineData ){
		var range = TileScaleHelper.getViewRange( TSINTERFACE.viewContext ),
			tileNode = null,
			// NOTE
			// A new drawPacket is created every frame update
			// potential optimization would be to create a single global instance
			dataPacket = new TileDrawPacket( routineData, range ); // Defined in game/render/routines/tiledraw.js
		TSINTERFACE.analytics.range = range;
		nestedIncriment([-1, -1], [range.z+5, range.a+5], (x, y) => {
			tileNode = routineData.world.getObject(x + range.x, y + range.y);
			if( tileNode ){
				// Stop creating new ones, update to save memory
				// This works because everything is processed in order
				dataPacket.update(x, y);
				if (tileNode) {
					
					if(routineData.viewContext.frameCounter % routineData.viewContext.visualUpdateInterval == 0){
						tileNode.object.updateVisualState( dataPacket );
					}
					tileNode.object.drawRoutine(dataPacket);
				} else {
					TSINTERFACE.Tile.empty.drawRoutine(dataPacket);
				}
			}
		});
	}
	*/

	requestRedraw(){
		this.needsRedraw = true;
	}

}