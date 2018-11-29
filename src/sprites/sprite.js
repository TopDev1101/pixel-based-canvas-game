class Sprite extends Actor{
    constructor(){
		super("sprite");
        this.source = Townsend.spritesheet.grounds;
        this.sources = {};

        this.width = cfg.tile_size;
        this.height = cfg.tile_size;
        
        
        this.wChunk = null;
		this.wPixelCoordVect = null;
		this.wGlobalTileCoordVect = null;
    }
    
    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates
	 */
	t3_drawRoutine( chunk, coordVect, globalTileCoordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.wChunk = chunk;
		this.wPixelCoordVect = pCoordVect;
		this.wGlobalTileCoordVect = globalTileCoordVect;
		this.t3_draw( chunk, pCoordVect, globalTileCoordVect );
    }

    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative tile coordinates
	 */
	t3_clearRenderingSpace( chunk, coordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.t3_clearGround( chunk, pCoordVect );
    }
    
    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_clearGround( chunk, pCoordVect ){
		var ctx = chunk.renderer.canvasCtx;
		ctx.clearRect( pCoordVect.x, pCoordVect.y, this.width, this.height );
	}
}

class PrerenderableSprite extends Sprite{
    constructor( prerenderOnConstruct ){
        super();
		this.prerenderWidth = cfg.tile_size;
		this.prerenderHeight = cfg.tile_size;
		this.needsPrerender = false;	// Set to true for tiles that need pre-rendering
		this.isPrerendered = false;
        this.hasDepth = false;		// If the tile sprite occupies more than a single tile-space

        if( prerenderOnConstruct ){
            this.prerender();
        }
    }

    prerender(){
		this.prerenderCanvas = document.createElement("canvas");
		this.prerenderCanvas.width = this.prerenderWidth;
		this.prerenderCanvas.height = this.prerenderHeight;
        this.prerenderCtx = this.prerenderCanvas.getContext("2d");
        this.t3_prerender();
		this.isPrerendered = true;
    }

    /**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates
	 */
	t3_drawRoutine( chunk, coordVect, globalTileCoordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.wChunk = chunk;
		this.wPixelCoordVect = pCoordVect;
		this.wGlobalTileCoordVect = globalTileCoordVect;
		if( this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready ){
			this.t3_prerender( chunk, pCoordVect, globalTileCoordVect );
		}
		this.t3_draw( chunk, pCoordVect, globalTileCoordVect );
    }

    t3_draw( chunk, pCoordVect, globalTileCoordVect ){}
	t3_prerender(){}
}