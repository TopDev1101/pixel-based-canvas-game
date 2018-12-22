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
		return new Rectangle(
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
		return new Rectangle(
			Math.floor(- viewContext.pixelOffset.x / viewedChunkSize)+cfg.render_chunk_offset_x, 
			Math.floor(- viewContext.pixelOffset.y / viewedChunkSize)+cfg.render_chunk_offset_y,
			Math.floor(xSize)+cfg.render_chunk_extra_x, Math.floor(ySize)+cfg.render_chunk_extra_y + (scaleHelper.scale>0?1:0)
		);
	}
}