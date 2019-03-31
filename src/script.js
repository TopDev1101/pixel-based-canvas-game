var _TileViewContext, world, heap;
TSINTERFACE.analytics.flow = 0;

function init() {

	//initializeTileDrawRoutine();
	_TileViewContext = new TileViewContext();
	TSINTERFACE.viewContext = _TileViewContext;
	TSINTERFACE.canvases = TSINTERFACE.viewContext.renderingManager.canvases;
	TSINTERFACE.canvasContexts = TSINTERFACE.viewContext.renderingManager.contexts;

	// Shorthands
	TSINTERFACE.VC = TSINTERFACE.viewContext;
	TSINTERFACE.VCCUR = TSINTERFACE.viewContext.cursor;
	TSINTERFACE.GCUR = new CursorInteractionContext( null, document.body );
	TSINTERFACE.VCTSH = TSINTERFACE.viewContext.tileScaleHelper;
	TSINTERFACE.CVS = TSINTERFACE.canvases;
	TSINTERFACE.CVSCTX = TSINTERFACE.canvasContexts;


	world = new World();
	TSINTERFACE.World = world;
	world.createNewMap( onWorldChunksDoneLoading);
	
	
	// TSINTERFACE.locked.doBatching
}

function onWorldChunksDoneLoading(){
	TSINTERFACE.progressBarUpdaters.chunkRender = Townsend.loadingScreen.createProgressBar( "chunk-render", "Rendering chunks" );
	TSINTERFACE.viewContext.initDrawRoutines();
	TSINTERFACE.viewContext.draw();
	TSINTERFACE.viewContext.tileScaleHelper.scale = 0.25;
	// Well, it renders. The cursor context needs work though
	
	createDebugWindow();

	TSINTERFACE.World.updateloop();

	
	for( var i = 0; i < cfg.testing_entity_amount; i++ ){
		TSINTERFACE.World.entities.push( new EntityPerson() );
	}

	setupMouseHandlers( TSINTERFACE.GCUR, TSINTERFACE.VCCUR );
}

function onWorldChunksDoneRendering(){

}

function setupMouseHandlers( globalCursorEnv, cursorEnv ){
	cursorEnv.addHandler("onmousemove", handle_elementHover);
	globalCursorEnv.addHandler("onmousemove", handle_globalHover);
	cursorEnv.addHandler("onmousemove", handle_mouseDrag);
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
	dbgWindow.addWatcher( null, "heapUsed", (n)=>{ var a = TSINTERFACE.safety.heapWatch(); return Math.floor(a/1024/1024)+"/"+cfg.memory_max+" Mb";} );
	dbgWindow.addWatcher( null, "analytics_flow", ()=>{ return TSINTERFACE.analytics.flow; } );
	dbgWindow.addWatcher( _TileViewContext.pixelOffset, "pixeloffset" );
	dbgWindow.addWatcher( TSINTERFACE.analytics, "general_analytics");
}

init();