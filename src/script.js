var _TileViewContext, world, heap;
Townsend.analytics.flow = 0;

function init() {

	//initializeTileDrawRoutine();
	_TileViewContext = new TileViewContext();
	Townsend.viewContext = _TileViewContext;
	Townsend.canvases = Townsend.viewContext.renderingManager.canvases;
	Townsend.canvasContexts = Townsend.viewContext.renderingManager.contexts;

	// Shorthands
	Townsend.VC = Townsend.viewContext;
	Townsend.VCCUR = Townsend.viewContext.cursor;
	Townsend.GCUR = new CursorInteractionContext( null, document.body );
	Townsend.VCTSH = Townsend.viewContext.tileScaleHelper;
	Townsend.CVS = Townsend.canvases;
	Townsend.CVSCTX = Townsend.canvasContexts;


	world = new World();
	Townsend.World = world;
	
	
	// Townsend.locked.doBatching
	

	_TileViewContext.initDrawRoutines();
	_TileViewContext.draw();
	_TileViewContext.tileScaleHelper.scale = 0.25;
	// Well, it renders. The cursor context needs work though
	
	createDebugWindow();

	Townsend.World.updateloop();

	
	for( var i = 0; i < cfg.testing_entity_amount; i++ ){
		Townsend.World.entities.push( new EntityPerson() );
	}

	setupMouseHandlers( Townsend.GCUR, Townsend.VCCUR );
}

function setupMouseHandlers( globalCursorEnv, cursorEnv ){
	cursorEnv.addHandler("onmousemove", handle_elementHover);
	globalCursorEnv.addHandler("onmousemove", handle_globalHover);
	cursorEnv.addHandler("onmousemove", handle_placeBlock);
	cursorEnv.addHandler("onmousemove", handle_moveMap);
	cursorEnv.addHandler("onmousedown", handle_elementMousedown);
	cursorEnv.addHandler("onmouseup", handle_elementMouseup);
	cursorEnv.addHandler("onmousewheel", handle_debugScrollIncriment);
}

// No

function createDebugWindow(){
	dbgWindow = new DebugWindow( cfg.debug_window_Width );
	dbgWindow.addWatcher( _TileViewContext, "fps", (a)=>{return a.fps;} );
	dbgWindow.addWatcher( _TileViewContext.cursor.position.values, "mp" );
	dbgWindow.addWatcher( null, "heapUsed", (n)=>{ var a = Townsend.safety.heapWatch(); return Math.floor(a/1024/1024)+"/"+cfg.memory_max+" Mb";} );
	dbgWindow.addWatcher( null, "analytics_flow", ()=>{ return Townsend.analytics.flow; } );
	dbgWindow.addWatcher( _TileViewContext.pixelOffset, "pixeloffset" );
	dbgWindow.addWatcher( Townsend.analytics, "general_analytics");
}

init();