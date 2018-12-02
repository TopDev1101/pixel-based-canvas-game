

class SpecialTilePayload{
	constructor( tile, position ){
		this.tile = tile;
		this.position = position;
	}
}

class World{
    constructor( saveData ){
		this.entities = [];
		this.chunkSize = cfg.world_chunkSize;
		this.defaultTile = TSINTERFACE.tiles.default;
		this.map = new UboPlane( {} ); // UboPlane<TileMap>
		this.chunks = [];
		this.chunkNeedsPrerender = [];

		this.seed = cfg.debug_seed_default;
		this.generation = new WorldGen( this.seed );
		this.noise = {
			elevation: new SIMPLEX_NOISE( this.seed+"stone" )
		};

		this.jobs = [];

		this.mapLength = cfg.world_map_size_debug; // A side length of the map in chunks, must be even
		this.totalChunks = 0;
		this.renderedChunks = 0;

		this.lastTopLeftBound = new Vector(0,0);
		this.lastBottomRightBound = new Vector(0,0);
		this.topLeftBoundResizeDiff = new Vector(0,0);
		this.topLeftBound = new Vector(0,0);
		this.bottomRightBound = new Vector(0,0);
		this.origin = new Vector(0,0);
		this.height = 32;
		this.width = 32;
		this.boundsChanged = false;
		this.paused = false;
		this.updateInterval = cfg.update_interval_normal;

		this.lastUpdateTime = new Date().getTime();

		this.udps = 0;
		this.udc = 0;
		this.udl = new Date().getTime();
		this.udlt = new Date().getTime();
		this.udps = 0;

		this.updateStart = new Date().getTime();

		this.time = 10;
		this.ticks = 0;

		this.run = true;

		this.specialTiles = {};
		this.specialTileLocations = {};

		// No world states go after this
		this.createNewMap();

		this.timeInterval = this.startTimeInterval();
	}

	updateUDS(){
		var udtn = new Date().getTime();
		
		if( udtn - this.udlt >=1000 ){
			this.udps = this.udc;
			this.udc = 0;
			this.udlt = udtn;
		}else{
			this.udc++;
		}
	}

	/**
	 * searches for a tile that has 
	 * @param {*} tileIdentifier Actor.identityString
	 * @param {*} queryFunction callback( specialTilePayload );
	 */
	querySpecialTiles( tileIdentifier, queryFunction ){
		var out = null, tileGroup = this.specialTiles[tileIdentifier];
		if(tileGroup){
			var tileUUIDs = Object.keys(tileGroup);
			for( var tileUUIDIndex = 0; tileUUIDIndex < tileUUIDs.length; tileUUIDIndex++){
				var payload = tileGroup[ tileUUIDs[ tileUUIDIndex ] ];
				if( queryFunction( payload ) ){
					out = payload;
					break;
				}
			}
		}
		return out;
	}

	confirmSpecialTileGroupExists( tile ){
		if(!this.specialTiles[ tile.identityString ] ){
			this.specialTiles[ tile.identityString ] = {};
		}
	}

	/**
	 * Adds a special tile, used for lookup and indexing
	 * @param {Tile} tile 
	 * @param {CoordinateVector} position globalTilePosition
	 */
	addSpecialTile( tile, position ){
		this.confirmSpecialTileGroupExists( tile );
		var payload = new SpecialTilePayload( tile, position );
		this.specialTiles[ tile.identityString ][ tile.uuid ] = payload;
		this.specialTileLocations[ position.string ] = tile;
	}

	/**
	 * 
	 * @param {CoordinateVector} position globalTilePosition
	 */
	removeSpecialTile( position ){
		var tile = this.specialTileLocations[ position.string ];
		this.confirmSpecialTileGroupExists( tile );
		delete this.specialTiles[ tile.identityString ][ tile.uuid ];
		delete this.specialTileLocations[ position.string ];
	}

	placeTile( tile, x, y ){
		if( this.specialTileLocations[ `${x}_${y}` ] ){
			this.removeSpecialTile( new Vector(x,y) );
		}
		if(tile.isSpecial){
			this.addSpecialTile( tile, new Vector(x,y) );
		}
		this.placeObject( tile, x, y );
	}

	removeTile( x, y ){
		this.placeTile( TSINTERFACE.tiles.default, x, y );
	}

	updateloop(){
		var self = this;
		if( new Date().getTime() - this.lastUpdateTime >= this.updateInterval ){
			this.lastUpdateTime = new Date().getTime();
			this.update();
		}
		setTimeout( ()=>{ self.updateloop.apply(self); }, 0 );
	}

	update(){
		this.updateCost = new Date().getTime() - this.updateStart;
		this.updateStart = new Date().getTime();
		var self = this;
		if(self.paused){
			return;
		}
		self.ticks++;
		this.updateUDS();
		self.entities.map( (entity)=>{
			entity.update(self.ticks);
		});
		TSINTERFACE.analytics.udps = this.udps;
		/*
		setTimeout( ()=>{
			self.chunks.map( (chunk)=>{
				chunk.update(self.ticks);
			});
		});*/
	}

	increaseRenderedChunks(){
		this.renderedChunks++;
		TSINTERFACE.analytics.chunksLoaded = this.renderedChunks+"/"+this.totalChunks;
	}
	
	startTimeInterval(){
		var self = this;
		setInterval( ()=>{ self.changeTime(); }, 10000);
	}

	changeTime(){
		this.time++;
		TSINTERFACE.analytics.time = this.time;
		if(!cfg.world_time_draw_enable){return;}
		var ctx = TSINTERFACE.CVSCTX.lightsOverflow;
		ctx.fillStyle = new Color( 10, 5, 20 ).rgbString;
		ctx.globalAlpha = ( Math.abs( (this.time % 20) - 10 ) / 10 ) / 1.15;
		ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
		ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
	}

	/**
	 * Checks if tile at (globalX, globalY, [globalZ]) is an obstacle
	 * @param {*} globalX 
	 * @param {*} globalY 
	 * @param {*} globalZ 
	 */
	isObstacle( globalX, globalY, globalZ ){

	}

	/**
	 * Gets the full map node payload at (globalX, globalY)
	 * ! Includes tile metadata
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	getPayloadNode( globalX, globalY ){
		// Find out which chunk
		var chunk = this.getChunkFromTile( globalX, globalY );
		if( chunk ){
			return chunk.getObject(
				Math.mod( globalX, this.chunkSize ),
				Math.mod( globalY, this.chunkSize )).payload.tile;
		}
		return null;
	}

	/**
	 * Get the tile at (globalX, globalY)
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	getTile( globalX, globalY ){
		// Find out which chunk
		var chunk = this.getChunkFromTile( globalX, globalY );
		if( chunk ){
			return chunk.getObject(
				Math.mod( globalX, this.chunkSize ),
				Math.mod( globalY, this.chunkSize )).payload.tile;
		}else if(this.tileExists( globalX, globalY )){
			return TSINTERFACE.tiles.default;
		}
		return null;
	}

	/**
	 * Checks if a tile exists at (globalX, globalY)
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	tileExists( globalX, globalY ){
		return !!this.getPayloadNode(globalX, globalY);
	}

	/**
	 * Get a tile along with more information relating to the tile
	 * @param {Number} globalX 
	 * @param {Number} globalY 
	 */
	getTilePlus( globalX, globalY ){
		var self = this;
		return {
			tile:this.getTile(globalX, globalY),
			chunk:this.getChunkFromTile( globalX, globalY ),
			position: new Vector( globalX, globalY ),
			chunkRelPosition: new Vector(globalX, globalY).forEach( (n)=>{ return Math.mod( n, self.chunkSize );} )
		};
	}

	/**
	 * Places down an object into the uboplane
	 * ! Does not manipulate the map state to recognize that the object is a tile
	 * @param {*} object 
	 * @param {*} globalX 
	 * @param {*} globalY 
	 */
	placeObject( object, globalX, globalY ){
		var chunk = this.getChunkFromTile( globalX, globalY );
		if( chunk ){
			return chunk.t3_placeTile(object,
				Math.mod( globalX, this.chunkSize ),
				Math.mod( globalY, this.chunkSize ));
		}
	}
	
	/**
	 * Gets a chunk at ( chunkX, chunkY )
	 * @param {*} chunkX 
	 * @param {*} chunkY 
	 */
	getChunk(chunkX, chunkY){
		var chunkNode = this.map.getObject( chunkX,chunkY );
		if( chunkNode ){
			return chunkNode.object;
		}
		return null;
	}

	/**
	 * Gets the chunk at tile location ( globalX, globalY )
	 * @param {Number} globalX Global X
	 * @param {Number} globalY Global Y
	 */
	getChunkFromTile( globalX, globalY ){
		var chunkX = ( globalX - Math.mod(globalX, this.chunkSize) ) / this.chunkSize,
			chunky = ( globalY - Math.mod(globalY, this.chunkSize) ) / this.chunkSize,
			chunkNode = this.map.getObject( chunkX,chunky );
		if( chunkNode ){
			return chunkNode.object;
		}
		return null;
	}

	getObjectsAt( globalX, globalY ){
		var gtCoordVect = new Vector( globalX, globalY );
		return {
			entities: this.entities.filter( ( entity )=>{ return entity.globalTilePosition.equals( gtCoordVect ); } ),
			tiles: this.getTile( globalX, globalY )
		};
	}

	/**
	 * Creates a new chunk at ( cx, cy )
	 * @param {Number} cx ChunkX
	 * @param {Number} cy ChunkY
	 */
	createChunk( cx,cy ){
		var self = this,
			chunkActor = new ChunkActor( self, this.chunkSize,new Vector(cx,cy) ),
			chunk = chunkActor.chunk;
			
		nestedIncriment([0,0],[this.chunkSize,this.chunkSize],(tileX,tileY)=>{
			self.generateTile(chunk,tileX,tileY);
		});

		self.map.placeObject( cx, cy, chunk );

		// Depreciated
		this.chunkNeedsPrerender.push(chunk);
		this.chunks.push(chunk);

		if(cfg.debug_chunk_load_mode=="sync"){
			document.title = self.chunks.length;
			//chunk.renderer.t3_drawProtocol();
		}

		//self.adjustRegionalBounds( cx, cy );
		//self.adjustBatchingCanvas();
		return chunk;
	}
	
	
	/**
	 * This is called to generate chunks by placing down some tiles
	 * @param {TileMap} chunk 
	 * @param {Integer} tileX 
	 * @param {Integer} tileY 
	 */
	generateTile( chunk,tileX,tileY ){
		var coords = chunk.chunkRelCoordsToGlobalRelCoords( new Vector( tileX, tileY ) );
		// generate stone
		var elevation = this.generation.getElevationAt(coords.x, coords.y)
		if( elevation >= cfg.generation_stone_threshold){
			var n = Math.floor(elevation*10);
			if( n % 2 == 0 ){
				chunk.t3_placeTile(TSINTERFACE.tiles.stone, tileX,tileY);
			}else{
				chunk.t3_placeTile(TSINTERFACE.tiles.stoneMeta1, tileX,tileY);
			}
		}else if( elevation <= -cfg.generation_stone_threshold){
			if(elevation <= -cfg.generation_stone_threshold-0.05){
				chunk.t3_placeTile(TSINTERFACE.tiles.water, tileX,tileY);
				return;
			}
			chunk.t3_placeTile(TSINTERFACE.tiles.sand, tileX,tileY);
			return;
			if (Math.random() <= cfg.world_treePlacementModifier) {
				chunk.t3_placeTile(TSINTERFACE.tiles.berryBush, tileX,tileY);
			}
		}
	}

	createNewMap(){
		var self = this;
		nestedIncriment([-Math.floor( self.mapLength/2 ),-Math.floor( self.mapLength/2)],[ self.mapLength/2 ,self.mapLength/2],( cx, cy )=>{
			var chunk = self.createChunk(cx,cy);
			self.totalChunks++;
			// Make sure it doesn't load over the memory limit
			TSINTERFACE.safety.heapWatch();
		});
	}








	/////////////////
	// Depreciated //
	/////////////////

	adjustRegionalBounds(cx, cy){
		var globalOffsetX = cx*this.chunkSize*16, // 16 is the tile width
			globalOffsetY = cy*this.chunkSize*16;
		
		this.lastTopLeftBound = this.topLeftBound.copy();
		this.lastBottomRightBound = this.bottomRightBound.copy();

		// Determine if the bounds require change
		if(globalOffsetX<this.topLeftBound.x){ this.topLeftBound.x = globalOffsetX; this.boundsChanged = true; }
		if(globalOffsetX>this.bottomRightBound.x){ this.bottomRightBound.x = globalOffsetX; this.boundsChanged = true;}
		if(globalOffsetY<this.topLeftBound.y){ this.topLeftBound.y = globalOffsetY; this.boundsChanged = true;}
		if(globalOffsetY>this.bottomRightBound.y){ this.bottomRightBound.y = globalOffsetY; this.boundsChanged = true;}

		this.topLeftBoundResizeDiff = this.lastTopLeftBound.subtract( this.topLeftBound );
	}

	adjustBatchingCanvas(){
		if( this.boundsChanged ){
			this.boundsChanged = false;
			this.resizeBatchingPlaceholders();
			this.holdBatchInPlaceholders();
			this.adjustRegionDimensions();
			this.resizeBatchingCanvases();
			this.restorePreviousBatches();
		}
		
	}

	resizeBatchingPlaceholders(){
		TSINTERFACE.canvases.batchLowerResizePlaceholder.height = this.height;
		TSINTERFACE.canvases.batchLowerResizePlaceholder.width = this.width;
		TSINTERFACE.canvases.batchOverflowResizePlaceholder.height = this.height;
		TSINTERFACE.canvases.batchOverflowResizePlaceholder.width = this.width;
	}

	/**
	 * Paste already-batched data into the placeholders to prevent the need to re-render
	 */
	holdBatchInPlaceholders(){
		TSINTERFACE.CVSCTX.batchLowerResizePlaceholder.clearRect( 0,0,TSINTERFACE.canvases.batchLower.width, TSINTERFACE.canvases.batchLower.height );
		TSINTERFACE.CVSCTX.batchOverflowResizePlaceholder.clearRect( 0,0,TSINTERFACE.canvases.batchOverflow.width, TSINTERFACE.canvases.batchOverflow.height );
		TSINTERFACE.CVSCTX.batchLowerResizePlaceholder.drawImage( TSINTERFACE.canvases.batchLower, 0, 0 );
		TSINTERFACE.CVSCTX.batchOverflowResizePlaceholder.drawImage( TSINTERFACE.canvases.batchOverflow, 0, 0 );
	}

	/**
	 * Adjusts some internal values for further calculation
	 */
	adjustRegionDimensions(){
		this.width = Math.abs( this.topLeftBound.x ) + this.bottomRightBound.x;
		this.height = Math.abs( this.topLeftBound.y ) + this.bottomRightBound.y;
		this.origin = new Vector( -this.topLeftBound.x, -this.topLeftBound.y );
	}

	/**
	 * Resizes the batching canvases
	 */
	resizeBatchingCanvases(){
		TSINTERFACE.canvases.batchLower.height = this.height;
		TSINTERFACE.canvases.batchLower.width = this.width;
		TSINTERFACE.canvases.batchOverflow.height = this.height;
		TSINTERFACE.canvases.batchOverflow.width = this.width;
		TSINTERFACE.CVSCTX.batchLower.clearRect( 0,0,TSINTERFACE.canvases.batchLower.width, TSINTERFACE.canvases.batchLower.height );
		TSINTERFACE.CVSCTX.batchLower.clearRect( 0,0,TSINTERFACE.canvases.batchOverflow.width, TSINTERFACE.canvases.batchOverflow.height );
	}

	/**
	 * Restores previously pre-rendered batches to the newly resized canvases
	 */
	restorePreviousBatches(){
		TSINTERFACE.CVSCTX.batchLower.drawImage( TSINTERFACE.canvases.batchLowerResizePlaceholder, this.topLeftBoundResizeDiff.x, this.topLeftBoundResizeDiff.y );
		TSINTERFACE.CVSCTX.batchLower.drawImage( TSINTERFACE.canvases.batchLowerResizePlaceholder, this.topLeftBoundResizeDiff.x, this.topLeftBoundResizeDiff.y );
	}

	initialBatchRender(){
		while( this.chunkNeedsPrerender.length!=0 ){
			document.title = `Chunks left to prerender: ${this.chunkNeedsPrerender.length}`;
			this.chunkNeedsPrerender.pop().batchRender(  );
		}
	}
	
}