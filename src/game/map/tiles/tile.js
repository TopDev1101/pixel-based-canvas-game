/**
 * Default tile
*/
class Tile extends Actor{
	constructor(){
		super();
		this.needsVisualUpdate = false;
		this.tileSize = cfg.tile_size;
		this.eventEmitter = new SimpleEventEmitter(0);

		// Template properties
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighbourDependent = false; // If the sprite state depends on it's neighbours
		this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
		this.sprite = new TileSprite( this );
		this.isSpecial = false;

		// Physical properties
		this.isObstacle = false;

		this.addIdentity("tile");

		// Log when a new tile is created
		//ExecLims.log.tileCreate.call( this );

		/**
		 * 11/5/18
		 * I want to make pixel-space pathfinding a thing
		 * Best way to do so might be to make 2 new classes, TilePath and TilePathCollection
		 * which store the path between each entry point and the center point of a tile
		 * 
		 * and a TilePathCollectionCollection which stores paths for each type of tile
		 * accessed by a string formed from the tile's identites (which is not unique for different tile types)
		 */
		this.entryPoints = [
			new Vector( 0, 8 ),
			new Vector( 15, 8),
			new Vector( 8, 0),
			new Vector( 8, 15)
		]
		this.centerPoint = new Vector( 8, 8 );

		// Top it all off
		this.setupEvents();
	}

	toString(){
		return this.name;
	}

	get name(){ return "tile"; }

	////////////
	// EVENTS //
	////////////

	/**
	 * Setup the event listeners
	 */
	setupEvents(){
		var properties = Object.getAllOwnPropertyNames( this );
		var events = properties.filter( propName => (/^on_\w+$/m).test( propName ) );
		events.map( propName => this.eventEmitter.on( propName.split("on_")[1], this[propName] ), this );
	}
	
	/**
	 * Default metadata of this tile
	 */
	get defaultMetadata(){
		return {};
	}

	/**
	 * Get a list of neighbour offsets
	 */
	static get neighbours(){
		return TSINTERFACE.neighbourOffsetVectorList;
	}

	/**
	 * When the mouse is hovered over a tile
	 */
	static create_event_hovered(){}
	on_hovered( event ){
		
	}

	/**
	 * When a tile is constructed by an entity
	 * @param {event_constructed} event 
	 */
	on_constructed(  ){

	}

	/**
	 * When a tile is spawned in ( spawn routines, other tiles, or by cheating)
	 */
	on_spawned(){

	}

	on_placed( gCoordVect, world ){
		if(!this.world){this.world = world;}
        var position = gCoordVect;
        TSINTERFACE.neighbourOffsetVectorList.map( ( offsetVector )=>{
            var neighbourLocation = position.add(offsetVector);
            if( this.world.tileExists(...neighbourLocation.values)){
				var extendedTileData = this.world.getTilePlus( ...neighbourLocation.values );
				if( extendedTileData.tile.isNeighbourDependent ){
					extendedTileData.chunk.markTileForRendering( extendedTileData.tile, extendedTileData.chunkRelPosition );
				}
            }
        });
    }

	/**
	 * When a tile is removed
	 */
	on_removed(  ){

	}

	/**
	 * When an entity goes on top of a tile
	 */
	on_entity_above(  ){

	}

	/**
	 * When an entity is next to a tile
	 */
	on_entity_adjacent(  ){

	}

	/**
	 * when a tile gets destroyed by means of destruction
	 */
	on_destroyed(  ){

	}



	// Fun stuff
	/**
	 * Context menu > inspect
	 */
	get userInteraction_inspect(){
		return "This is a tile! Nothing out of the ordinary.";
	}




	/////////////////
	// DEPRECIATED //
	/////////////////
	/*
	static DEPRECIATED_drawBasic( drawData ){
		var tilesheet = data.TS.DFDefault,				// Tilesheet
			parent = data.parent,				// Parent data
			viewContext = data.viewContext,
			tileSize = viewContext.tileScaleHelper.tileSize,
			location = this.getTileSpriteLocation( tilesheet, drawData );	// Tile location data
			
		//this.drawGround( data );
		
		tilesheet.drawTile(
			parent.ctx,
			location,
			new Vector(	data.to.x, data.to.y ),
			tileSize,
			tileSize);
	}

	DEPRECIATED_prerender( drawData ){
		var renderingMan = drawData.viewContext.renderingManager,
			self = this;
		// Allocate an area for prerendering to occur
		self.prerenderIndex = renderingMan.requestCanvasAllocation( "prerendering", self.prerenderWidth );
		self.prerendersTypes.map( (prerenderIdentity, index)=>{
			var prerenderLocationData = {
				index: self.prerenderIndex,
				height: self.prerenderHeight*index
			};
			self.prerenders[prerenderIdentity] = prerenderLocationData;
			self[`prerender_${prerenderIdentity}`]( drawData, prerenderLocationData );
			
		});
		self.isPrerendered = true;
	}

	
	DEPRECIATED_drawGround( data ){
		var tilesheet = data.parent.TS.grass,		// Tilesheet
			routineData = data.parent,				// Parent data
			viewContext = data.viewContext,			// Draw Data
			location = tilesheet.getTileAt( 1, 0 );
		tilesheet.drawTile(
			routineData.viewContext.renderingManager.contexts.ground,
			location, data.to,
			viewContext.tileScaleHelper.tileSize,
			viewContext.tileScaleHelper.tileSize );

		//this.check_hovered( drawData );
	}


	DEPRECIATED_drawRoutine( dataPacket ){
		if(this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready){
			this.prerender( dataPacket );
		}
		this.draw( dataPacket );
	}

	DEPRECIATED_draw( data ){
		this.drawGround( data );
	}
	
	DEPRECIATED_drawHovered( data ){
		var tilesheet = data.parent.TS.DFDefault,				// Tilesheet
			routineData = data.parent,				// Parent data
			viewContext = data.viewContext,
			tileSize = viewContext.tileScaleHelper.tileSize;			// Draw Data
		
		routineData.ctxPipeline
			.setFillStyle( [ new Color(200,255,255,0.3).rgbaString ] )
			.beginPath()
			.rect([
				data.to.x,
				data.to.y,
				tileSize, tileSize])
			.fill();
		
		tilesheet.drawTile(
			routineData.ctx,
			location, data.to,
			tileSize,
			tileSize );
	}

	DEPRECIATED_needsRedraw(){
		return false;
	}

	// Batch rendering nonsense //
	get DEPRECIATED_batchContextOverflow(){return TSINTERFACE.viewContext.renderingManager.contexts.batchOverflow;}
	get DEPRECIATED_batchContextLower(){return TSINTERFACE.viewContext.renderingManager.contexts.batchLower;}
	DEPRECIATED_batchInstanceRenderProtocol( to ){
		to = to.scale( this.tileSize );
		this.batchInstanceDrawOverflow(to.subtract(TSINTERFACE.batch.overflowOffset));
		this.batchInstanceDrawLower(to);

	} ^/

	/**
	 * Changed for every instance of a new tile object
	 * Draw call for the overflow part of the tile sprite
	 * @param {CoordinateVector} to 
	 */
	/*
	DEPRECIATED_batchInstanceDrawOverflow( to ){}
	*/
	/**
	 * Changed for every instance of a new tile object 
	 * Draw call for the lower part of the tile sprite
	 * @param {CoordinateVector} to 
	 */
	/*
	DEPRECIATED_batchInstanceDrawLower( to ){}

	DEPRECIATED_experament_grassFlow(){
		states = 16,
		rows = 2,
		statesPerRow = states/rows,
		a = Math.floor((Math.floor(data.time*cfg.sprite_ground_flowFrameCoefficient)+(data.to.x-Math.sin(data.to.y/cfg.sprite_ground_flowSizeCoefficient))*states+(data.to.y)*states)%states),
		location = tilesheet.getTileAt( cfg.sprite_ground_y, a );	// Tile Sprite location
		//Math.round(7+(Math.abs(Math.sin( Math.floor(viewContext.frameCounter/10) + Math.pow((data.to.x+data.to.y),2)/4)))*4) 
		TSINTERFACE.analytics.flow = a;
	}
	*/
}

