class EntitySprite extends PrerenderableSprite{
	constructor(entity){
		super( true );

		if(Object.isUndefined( entity )){ throw "Error, tried constructing EntitySprite with no entity linked"; }
		this.entity = entity;

		this.source = Townsend.spritesheet.placeholders;
		this.sourceKey = this.source.getSpriteAt( 0, 1 );
		this.spriteSource = this.source; // Disambiguation 
        this.animationStartTime = new Date().getTime();
        
        this.spriteSize = new Vector( 0, 0 );

		this.wPixelCoordVect = null;
		this.wGlobalTileCoordVect = null;

		// Tweak the sprite's pixel location by this much
        this.spriteShift = new Vector(0,0);
		this.lastDrawRegion = new PlanarRangeVector(0,0,0,0);
		
		this.placeholderCanvas = document.createElement("canvas");
		this.placeholderCtx = this.placeholderCanvas.getContext("2d");

		this.placeholderCanvas.width = 10;
		this.placeholderCanvas.height = 10;
    }
    
    get getDrawRegion(){
        return new PlanarRangeVector( ...Townsend.VCTSH.convertGPtoSP(this.entity.globalPixelPosition.add( Townsend.viewContext.pixelOffset ).add(this.spriteShift).add(this.entity.globalPixelPosition)).values, ...this.spriteSize.scale( Townsend.VCTSH.coefficient ).values );
    }

	t3_drawRoutine(){
		var pCoordVect = this.entity.globalPixelPosition.add( Townsend.viewContext.pixelOffset ).add(this.spriteShift);
		this.wPixelCoordVect = pCoordVect;
		if( this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready ){
			this.t3_prerender();
		}
		//this.t3_setupPlaceholder();
        this.lastDrawRegion = this.getDrawRegion;
        this.t3_draw( pCoordVect );
	}
	
	/**
	 * @deprecated
	 */
	t3_setupPlaceholder(){
		var canvas = this.placeholderCanvas,
			ctx = this.placeholderCtx,
			region = this.lastDrawRegion;
		
		// Clear and resize the placeholder
		canvas.width = region.width || 1;
		canvas.height = region.height || 1;
		ctx.clearRect(0,0,region.width,region.height);
		// Fills the placeholder with whatever was behind the entity
		ctx.drawImage( Townsend.canvases.ground, ...region.values, 0, 0, region.width, region.height );
		ctx.drawImage( Townsend.canvases.overflow, ...region.values, 0, 0, region.width, region.height );
		ctx.drawImage( Townsend.canvases.entities, ...region.values, 0, 0, region.width, region.height );
		// draws the placeholder before drawing the entity
	}

	/**
	 * Chances are, the entity won't be asked to be drawn unless it's in range of the screen.
	 * So all those other parameters are pretty useless
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_draw( pCoordVect ){}
	t3_prerender(){}

}

class EntityJob{
	constructor( destination = new Vector(0,0) ){
		this.destination = destination;
	}

	createProtocolInstance(){
		return [
			{task:"move", params:this.destination }
		];
	}
}