/* File source: ../src/Ambitious_Dwarf///src/engine/dev/debugs.js */
/**
 * Standard execution limit
 */
var stdExecLimit = 100;

/**
 * Global limted execution functions
 */
var ExecLims = {
    log:{
        /**
         * Logs a tile being created
         */
        tileCreate: new ExecutionLimiter( stdExecLimit, console.log ),
        batchTileCoord: new ExecutionLimiter( 200, console.log )
    }
};

/**
 * The debug window provides useful information for analysis and debugging
 */
class DebugWindow{
    /**
     * Creates a new DebugWindow
     * @param {Number} width Width of the debug window container HTMLDivElement
     */
    constructor( width ){

        this.element = document.createElement("div");
        this.width = width;
        DebugWindow.stylizeElement(this.element);
        this.watchers = {};
        this.configurators = {};
        this.collapsibles = {};

        if(!cfg.debug_enable){
            console.warn(`"Debug is not enabled!" cfg.debug_enabled`);
            return;
        }
        
        this.appendWindowToBody( document.body );
    }

    /**
     * Appends the window to a HTMLElement
     * @param {*} element 
     */
    appendWindowToBody( parentElement ){
        parentElement.appendChild( this.element );
    }

    /**
     * Adds debugWindow style to an element
     * @param {HTMLElement} element 
     */
    static stylizeElement( element ){
        element.style.zIndex = 1000;
        element.style.width = this.width;
        element.style.position = "absolute";
        element.style.top = "0px";
        element.style.right = "0px";
        element.style.color = "white";
        element.style.wordWrap="break-word";
        element.style.fontSize=cfg.debug_window_FontSize;
        element.style.padding=3;
        element.style.backgroundColor = new Color(10, 15, 25, 0.5).rgbaString;
    }
    
    addCollapsable( id, contents ){

    }

    // Creates a section with a form for changing values
    addConfigurator( desc, on_submit ){
        
    }
    
    addWatcher( value, identity, fmt=JSON.stringify ){
        if(!cfg[`debug_${identity}_enable`]){
            console.warn(`"Watcher for [ ${identity} ] not enabled in config!" cfg.debug_${identity}_enabled`);
            return;
        }

        var self = this,
            watcher = {
                element: document.createElement("div")
            },
            element = watcher.element;
            
        self.watchers.interval = setInterval( ()=>{
            element.innerHTML = identity+": "+fmt( value );
        }, `cfg.debug_${identity}_interval` || cfg.debug_defaultInterval );

        self.element.appendChild( element );
        self.watchers[ identity ] = watcher;
    }
}

/* File source: ../src/Ambitious_Dwarf///src/engine/render/rendering.js */
var global = this;

class RenderingManager{
	/**
	 * RenderingManager holds canvases
	 * @param {String[]} canvasIdentifierList a string-list of canvas identifiers
	 */
	constructor(canvasIdentifierList) {
		var self = this;
		// If no canvas list is given, default to [ rendering, prerendering ]
		canvasIdentifierList = canvasIdentifierList ? canvasIdentifierList : [STR.ID.rendering, STR.ID.prerendering];

		new PropertyPipeline(self)
			.set("canvases", {})
			.set("contexts", {})
			.set("allocationIndecies",{})
			.set("drawRoutines", {})
			.set("canvasPipelines", {})
			.set("renderProxy", {});
		
		if( !CRContext2DProxy ){ throw STR.combine( [ STR.class.CRContext2DProxy, STR.error.NF ] ); }
		
		// Setup canvases
		canvasIdentifierList.map( ( canvasIdentifier, i, arr )=>{
			var canvas = document.createElement( STR.htmlTag.CANVAS ),
				context = canvas.getContext( STR.ID.contextType );
			
			self.canvases[canvasIdentifier] = canvas;
			self.contexts[canvasIdentifier] = context;
			self.canvasPipelines[canvasIdentifier] = new CRContext2DProxy(context);

			canvas.style.zIndex = (arr-i)*100;

			TSINTERFACE.Window.on("resize", ()=>{
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;		
				context.imageSmoothingEnabled = false;		
			})

			new PropertyPipeline(canvas)
					.set("className", canvasIdentifier)
					.set("id",canvasIdentifier)
					.set("width", window.innerWidth)
					.set("height", window.innerHeight)
					.set("imageSmoothingEnabled", false)
					.set("hide", function(){ this.style.visibility="hidden" })
					.close();

			self.allocationIndecies[ canvasIdentifier ] = 0;
			
			// Create a new routineCollection for this canvas
			self.drawRoutines[canvasIdentifier ] = new RoutineCollection();
			context.imageSmoothingEnabled = false;
		});

		// Assign-before-append
		document.body.appendChild( self.canvases.rendering );
		
		// CRContext2DProxy
		self.proxy = canvasIdentifierList[0];

		// The default canvas is the canvas assigned to the first identifier
		self.canvases.default = self.canvases[ canvasIdentifierList[ 0 ] ];

	}

	requestCanvasAllocation( canvasIdentifier, pixelWidth ){
		var availableIndex = this.allocationIndecies[ canvasIdentifier ];
		this.allocationIndecies[ canvasIdentifier ] +=pixelWidth;
		return availableIndex;
	}

	/**
	 * Assign a new drawroutine to a destination canvas
	 * @param {String} canvasIdentifier a canvas identifier
	 * @param {Routine} routine the drawroutine that will be assigned
	 */
	addRoutine( canvasIdentifier, routine ){
		var self = this;
		self.drawRoutines[ canvasIdentifier ].addRoutine( routine );
	}

	/**
	 * Call all drawroutines of a canvas
	 * @param {String} canvasIdentifier a canvas identifier
	 */
	render(canvasIdentifier ){
		var self = this;
		self.drawRoutines[canvasIdentifier ].call();
	}



	// Omit
	set proxy(canvasIdentifier ){
		var context = this.contexts[canvasIdentifier ];
		if( context ){
			this.renderProxy = new CRContext2DProxy(this.contexts[canvasIdentifier ] );
		}
	}
	
	get proxy(){
		return this.renderProxy;
	}
}

/* File source: ../src/Ambitious_Dwarf///src/interfacenw.js */
/**
 * Defines the main
 */

function openDebugMenu(){
    nw.Window.get().showDevTools();
}
function resizeWindow(){}

/* File source: ../src/Ambitious_Dwarf///src/engine/containers/spritesources.js */
/**
 * Tile locations are structs that tell you the space a tile occupies on a tilesheet
 */
class TileLocation{
	/**
	 * Creates a new tileLocation
	 * @param {CoordinateVector} _Vector$start The upper left position of the sprite
	 * @param {Vector} _Vector$size The size of the sprite
	 */
	constructor( _Vector$start, _Vector$size ){
		this.start = _Vector$start;
		this.size = _Vector$size ? _Vector$size : new Vector( 1, 1 );
	}
}

var createSource = {
	/**
	 * Creates an image source
	 * @param {String} srcPath Path of the image
	 * @param {Function{}} events HTMLElementEvent handlers 
	 */
	img: function( srcPath, events ){
		var img = document.createElement( STR.htmlTag.IMG );
		events = events? events:{};
		Object.keys( events ).map( (key)=>{
			img[ key ] = events[key];
		} );
		img.src = srcPath;
		return img;
	}
};

/**
 * Unused
 */
class TileManager{
	constructor(){
		this.tilesheets = [];
	}
	
	addTilesheet( _TileSheet ){
		_TileSheet.managerindex = this.tilesheets.length;
		this.tilesheets.push( _TileSheet );
	}
	
	getTileByIDString( idString ){
		
	}
	
	getTileIDString( _TileSheet ){
		
	}
}

/* File source: ../src/Ambitious_Dwarf///src/engine/containers/tilesheet.js */
/**
 * Tilesheets, spritesheets, whatever. They're the same thing and they should have been named the same thing.
 */
class Tilesheet{
	/**
	 * Creates a new spritesheet
	 * @param {HTMLImageElement/HTMLCanvasElement} _Source 
	 * @param {Number} unitSize Unit size of a tile
	 * @param {Callback} onload Called once the source is loaded
	 */
	constructor( _Source, unitSize, onload = ()=>{} ){
		this.source = _Source;
		var self = this;
		_Source.onload = (...args)=>{
			onload(...args);
			self.rows = _Source.height / unitSize;
			self.cols = _Source.width / unitSize;
		};
		this.tileLocations = {};		// Locations which tiles are stored within the tile sheet
		this.unitSize = unitSize || 1; // Tile unit size in pixels
		this.managerindex = 0;
	}
	
	/**
	 * Allows tiles to be looked up with a key-pair instead of hard coding tile locations
	 * Row major
	 * @param {String} identifier 
	 * @param {CoordinateVector} _TileLocation Tilesheet relative coordinates
	 */
	addTile( identifier, _TileLocation ){
		var uSize = this.unitSize;
		var h = _TileLocation.y;
		_TileLocation.y = _TileLocation.x;
		_TileLocation.x = h;
		_TileLocation = _TileLocation.scale( uSize );
		this.tileLocations[ identifier ] = _TileLocation;
	}
	
	/**
	 * Allows tiles to be looked up with a key-pair instead of hard coding tile locations
	 * @param {String} identifier 
	 * @returns {TileLocation}
	 */
	getTile( identifier ){
		return this.tileLocations[identifier];
	}
	
	/**
	 * Produces a vector of the upper left pixel position of a tile, based on the unit row and column
	 * @param {*} row 
	 * @param {*} col
	 * @returns {CoordinateVector}
	 */
	getTileAt( row, col ){
		var self = this;
		return new Vector( col, row ).scale( self.unitSize );
	}
	
	/**
	 * Draws a full tile
	 * @param {HTMLCanvasContext} _HTMLCanvasContext 
	 * @param {CoordinateVector} _Vector$start The upper left pixel position of the tile
	 * @param {CoordinateVector} _Vector$dest 
	 * @param {Number} width 
	 * @param {Number} height 
	 */
	drawTile( _HTMLCanvasContext, _Vector$start, _Vector$dest, width, height ){
		this.drawPartialTile( _HTMLCanvasContext, _Vector$start, this.unitSize, this.unitSize, _Vector$dest, width, height );
	}

	/**
	 * Draws part of a tile
	 * @param {HTMLCanvasContext} _HTMLCanvasContext 
	 * @param {CoordinateVector} _Vector$start 
	 * @param {Number} unitSizeW 
	 * @param {Number} unitSizeH 
	 * @param {CoordinateVector} _Vector$dest 
	 * @param {Number} width 
	 * @param {Number} height 
	 */
	drawPartialTile( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height ){
		_HTMLCanvasContext.drawImage( this.source,
			_Vector$start.x, _Vector$start.y,
			unitSizeW, unitSizeH,
			_Vector$dest.x, _Vector$dest.y,
			width, height
		);
	}

	/**
	 * If a spritesheet's sprites are within a single strip
	 * @param {*} _HTMLCanvasContext 
	 * @param {*} index 
	 * @param {*} sourceWidth 
	 * @param {*} sourceHeight 
	 * @param {*} width 
	 * @param {*} height 
	 */
	drawIndexed( _HTMLCanvasContext, index, sourceWidth, sourceHeight, width, height ){
		_HTMLCanvasContext.drawImage( this.source,
			index, 0,
			sourceWidth, sourceHeight,
			_Vector$dest.x, _Vector$dest.y,
			width, height
		);
	}
}

/* File source: ../src/Ambitious_Dwarf///src/engine/containers/spritesheet.js */
/**
 * Distinction between spritesheet and tilesheet? tilesheet should have been called something else.
 */
class Spritesheet extends Tilesheet{
	/**
	 * Creates a new spritesheet
	 * @param {HTMLImageElement/HTMLCanvasElement} _Source 
	 * @param {Number} unitSize Unit size of a tile
	 * @param {Callback} onload Called once the source is loaded
	 */
	constructor( _Source, unitSize, onload ){
		super( _Source, unitSize, onload );
	}
	
	/**
	 * Produces a vector of the upper left pixel position of a tile, based on the unit row and column
	 * @param {*} row 
	 * @param {*} col 
	 */
	getSpriteAt( ...args ){
		return this.getTileAt( ...args );
	}

	/**
	 * Draws part of a sprite
	 * @param {HTMLCanvasContext} _HTMLCanvasContext 
	 * @param {CoordinateVector} _Vector$start 
	 * @param {Number} unitSizeW 
	 * @param {Number} unitSizeH 
	 * @param {CoordinateVector} _Vector$dest 
	 * @param {Number} width 
	 * @param {Number} height 
	 */
	drawPartialSprite( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height ){
		this.drawPartialTile( _HTMLCanvasContext, _Vector$start, unitSizeW, unitSizeH, _Vector$dest, width, height );
	}

	/**
	 * Use the index of the sprite which gets mapped into tile coordinates
	 * @param {Number} index Index of the sprite
	 */
	getSpriteAtIndex( index ){
		return this.getSpriteAt( Math.floor( index / this.rows ), index % cols );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/render/viewcontext.js */
/**
 * Has data that will be used in rendering the map
 * pixelOffset - the offset of the mapview from 0,0
 * frameCounter - the total amount of frames drawn
 * scale - the scale of the tiles
 * tileSize - the size of a tile
 * scaleCoefficient - this times tileSize gives the size of a tile to be rendered
 * tileScaleSize - basically whats up there ^ but cached
 */

/**
 * ViewComponent defines the area which the game will be displayed
 */
class ViewContext { // Will eventually be split into TileViewContext and ViewContext
	/**
	 * View Component
	 */
	constructor() {
		var self = this;

		self.propipe = new PropertyPipeline(self)
			.set("cache", { package: {} })
			.set("children", {})
			.set("frameCounter", 0)
			.save();
	}

	// Was working on VCCAssign -->

	/**
	 * Cache packets of refrences
	 * Also for contexts to have easy access to other contexts
	 * @param {String} cacheIdentifier
	 * @param {Object[]} properties
	 */
	createCachePackage(cacheIdentifier, properties) {
		this.cache.package[cacheIdentifier] = properties;
	}

	/**
	 * Get a cached package
	 * @param {String} cacheIdentifier
	 */
	getCachePackage(cacheIdentifier) {
		return this.cache.package[cacheIdentifier];
	}

	/**
	 * Assign a context, must have certain methods to identify as a VCCompatableContext
	 * 
	 * Adding contexts links them all together, with respect to the parent
	 * This allows easy access to readily needed states while maintaining structure
	 * @param {any} context
	 */
	assignContext(contextInstance) {
		// If the contextInstance is a VCCompatibleContext
		if (VCContextCompatableInterface.confirm(contextInstance.__proto__)) {
			contextInstance.VCCAssign(this);
		}
	}
}

// Create a snapshot of object attributes access differences
// Best use for primitives
class AttributeSnapshot{
	constructor( object, attributesArray_String ){
		var self = this;
		self.object = object;
		self.snapshots = {};
		self.createSnap();
	}

	// Returns weather the attributes has changed from the snapshot
	compare(){
		var diff = 0,
			self = this;
		attributesArray_String.map( ( attr )=>{
			diff+= self.snapshots[attr] == self.object[attr] ? 0 : 1;
		});
		return diff <= 0;
	}

	createSnap(){
		var self = this;
		attributesArray_String.map( ( attr )=>{
			self.snapshots[attr] = self.object[attr];
		});
	}
}



/**
 * Uses of drawData:
 * engine/control/mouse.js
 * game/render/camera.js
 * game/render/routines/mouseupdate.js
 * game/render/routines/tiledraw.js
 * 
 * Uses of renederManager
 * game/render/camera.js
 * game/render/routines/mouseupdate.js
 *  game/render/routines/tiledraw.js
 */

/* File source: ../src/Ambitious_Dwarf///src/game/render/tilescalehelper.js */
class TileScaleHelper {
	constructor( _TiledViewContext ) {
		this.propipe = new PropertyPipeline( this );

		this.propipe
			.set("viewContext", _TiledViewContext)
			.set("tileSize", cfg.tile_size)
			.set("defaultTileSize", cfg.tile_size)
			.set("lastTileSize", cfg.tile_size)
			.set("cursorCorrection", this.newCursorCorrection) 
			.set("defaultChunkSize", cfg.world_chunkSize * cfg.tile_size )
			.set("chunkSize", cfg.world_chunkSize * cfg.tile_size)
			.set("lastChunkSize", cfg.world_chunkSize* cfg.tile_size)
			.set("lastTileScale", 0)
			.set("tileDeltaSign", 1)
			.set("tileScale", 0)
			.set("coefficient", 1);
	}
	
	get newCursorCorrection(){
		return new Vector(0,0);
		//return new Vector(0,self.tileSize/2);
	}

	/**
	 * Set the scale and update some properties
	 * This does weird things..
	 * @param {Number} n 
	 */
    set scale(n){
		var self = this;
		n =  Math.clamp(0, 2, n);
		self.propipe
			.set("lastTileSize", self.tileSize)
			.set("lastChunkSize",cfg.world_chunkSize * self.tileSize)
            .set("lastTileScale", self.tileScale)
            .set("tileScale", n)
            .set("coefficient", Math.pow( Math.E, n ))
			.set("tileSize", self.defaultTileSize * self.coefficient)
			.set("chunkSize", cfg.world_chunkSize * self.tileSize)
            .set("tileDelta", self.lastTileSize - self.tileSize )
            .set("cursorCorrection", self.newCursorCorrection)
			.save();
		
		this.adjustPixelOffset();
	}

	adjustPixelOffset(){
		TSINTERFACE.viewContext.pixelOffset.x-=window.innerWidth/2;
		TSINTERFACE.viewContext.pixelOffset.y-=window.innerHeight/2;
		TSINTERFACE.viewContext.pixelOffset.x*=this.tileSize/this.lastTileSize;
		TSINTERFACE.viewContext.pixelOffset.y*=this.tileSize/this.lastTileSize;
		TSINTERFACE.viewContext.pixelOffset.x+=window.innerWidth/2;
		TSINTERFACE.viewContext.pixelOffset.y+=window.innerHeight/2;
	}

	get scale(){
		return this.tileScale;
	}

	/**
	 * Global tile position to screen tile position
	 */
	convertGTtoSC(){

	}
	
	/**
	 * Global pixel position to screen pixel position
	 */
	convertGPtoSP( globalPixelPosition ){
		return this.viewContext.pixelOffset.add( globalPixelPosition );
	}
	
	/**
	 * Set the scale and update some properties
	 * @param {Number} n 
	 */
	setScale( n ){
		this.scale = n;
	}

	/**
	 * Evaluate the displayed tile size
	 * @param {Integer} sideLength in pixels
	 */
	evaluateTileSize( sideLength ){
		return sideLength * this.coefficient;
	}

	static getViewRange( _ViewContext ){
		var scaleHelper = _ViewContext.tileScaleHelper;
		var viewedTileSize = scaleHelper.tileSize;
		var xSize = window.innerWidth/viewedTileSize;
		var ySize = window.innerHeight/viewedTileSize;
		return new PlanarRangeVector(
			Math.floor(- _ViewContext.pixelOffset.x / viewedTileSize)-1, 
			Math.floor(- _ViewContext.pixelOffset.y / viewedTileSize)-1,
			Math.floor(xSize+2), Math.floor(ySize+2)
		);
	}

	static getChunksInViewRange(){
		var viewContext = TSINTERFACE.viewContext;
		var scaleHelper = viewContext.tileScaleHelper;
		var viewedChunkSize = scaleHelper.chunkSize;
		var xSize = window.innerWidth/viewedChunkSize;
		var ySize = window.innerHeight/viewedChunkSize;
		return new PlanarRangeVector(
			Math.floor(- viewContext.pixelOffset.x / viewedChunkSize)+cfg.render_chunk_offset_x, 
			Math.floor(- viewContext.pixelOffset.y / viewedChunkSize)+cfg.render_chunk_offset_y,
			Math.floor(xSize)+cfg.render_chunk_extra_x, Math.floor(ySize)+cfg.render_chunk_extra_y + (scaleHelper.scale>0?1:0)
		);
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/render/tileviewcontext.js */
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

