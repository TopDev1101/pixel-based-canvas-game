


/**
 * Assumes the interaction context is tiled, in structure
 */
class TiledCursorInteractionContext extends CursorInteractionContext{
	/**
	 * A TiledCursorInteractionContext defines a CursorInteractionContext
	 * that gets assigned to tiled entities
	 * @param {HTMLElement} element the element this context will be bound to
	 * @param {Integer} sidelength the sidelength (in pixels) of a tile
	 */
	constructor(_ViewContext ) {
		super(_ViewContext, _ViewContext.renderingManager.canvases.default /* CHange later LOL TODO */ );
		var self = this;
		self.tile = new Vector(0, 0);
		self.viewContext = _ViewContext;
		self.lastMousePosition = new Vector(0,0);
		self.lastClickPosition = new Vector(0,0);
		self.tilePlaceFunction = ( x, y )=> { TSINTERFACE.World.placeTile( TSINTERFACE.Tile.wall, x, y ); };
	}

	/**
	 * Requirement for VCCCompatableContextInterface
	 * return the context type identifier
	 * @param {ViewComponent} viewComponent parent viewcomponent
	 * @returns {String} the context type identifier
	 */
	vccAssign(viewComponent) {
		this.VCCAssignDefault( viewComponent );

		// Creates new cache package
		viewComponent.createCachePackage("mouseTilePos", this.tile);
		return "TiledCursorInteraction";
	}

	get cursorCorrection(){
		return this.cursorCorrectionVector;
	}

	set cursorCorrection( _Vector ){
		this.cursorCorrection = _Vector;
	}
}





///////////////////
// OLD REFERENCE //
///////////////////
/*

var getMouseTile = function (position) {
	var scalar = Math.pow(Math.E, drawData.scale) * drawData.tileSize;
	var x = position.x / scalar;
	var y = position.y / scalar;
	return new Vector(
		Math.floor(- drawData.offset.x / scalar + x) - 1, Math.floor(- drawData.offset.y / scalar + y) - 1,
	)
}

var mouse = {
	event: {},
	position: new Vector(0, 0),
	tile: new Vector(0, 0)
};

// DIDNT ACCOUNT FOR A MOVING SCREEN
var handleMouseMove = function (event) {
	mouse.position.x = event.clientX;
	mouse.position.y = event.clientY;

	updateMouseLocation(mouse.position);
}

var updateMouseLocation = function (position) {
	mouse.tile = getMouseTile(position);
	document.title = JSON.stringify(mouse.tile);
}

document.body.addEventListener("mousemove", handleMouseMove);

var mousePositionUpdateRoutine;
function mousePositionUpdateRoutineMethod( data ){
	var mouse = data.mouse;
		
	updateMouseLocation( mouse.position );
	
	var range = getViewRange( data.drawData ),
		x = mouse.tile.x,
		y = mouse.tile.y,
		tss = data.drawData.tileScaleSize;
	
	//console.log( range[1] );
	
	// Draw the rectangle
	
}
function createMouseRoutineData(){
	return {
		ctx: renderManager.contexts.rendering,
		drawData: drawData,
		map: map,
		mouse: mouse,
		boxColor: new Color(0, 0, 0, 1)
	};
}

function initializeMouseRoutine() {
	mousePositionUpdateRoutine = new Routine(
		mousePositionUpdateRoutineMethod,
		null, null,
		createMouseRoutineData
	);
	renderManager.addRoutine(STR.ID.rendering, mousePositionUpdateRoutine);
}

*/