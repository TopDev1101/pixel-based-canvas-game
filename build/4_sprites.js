/* File source: ../src/Ambitious_Dwarf///src/sprites/chunkrender.js */
class ChunkRenderer extends Actor{
    constructor( chunk ){
        super("sprite");
        this.chunk = chunk;

        this.canvas = document.createElement("canvas");
        this.canvasCtx = this.canvas.getContext("2d");
        this.canvas.width = this.chunk.size * cfg.tile_size;
        this.canvas.height = this.chunk.size * cfg.tile_size;

        this.canvasOverflow = document.createElement("canvas");
        this.canvasOverflowCtx = this.canvasOverflow.getContext("2d");
        this.canvasOverflow.width = 16;
        this.canvasOverflow.height = 16;

        this.debug_color = new Color( Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255), 0.5 ).rgbaString;

        this.drawCalls = 0;

        this.tilesNeedRendering = [];
        this.firstRenderDone = false;
    }

    // Basically the chunk's drawn state stays static unless it's in view
    t3_drawProtocol(){
        this.drawCalls++;
        if( !cfg.debug_enable_newChunkRenders ) return;
        if( !this.firstRenderDone && TSINTERFACE.allTilesheetsLoaded ){
            this.drawFirst();
        }
        this.drawUnrendered();
        this.drawDynamic();
        //this.drawNeighbourDependent();
    }

    drawFirst(){
        this.canvasOverflow.width = this.chunk.size * cfg.tile_size;
        this.canvasOverflow.height = this.chunk.size * cfg.tile_size;
        var coordVect = new CoordinateVector(0,0),
        globalTileCoordVect = null,
            self = this;
        nestedIncriment( [0,0], [this.chunk.size, this.chunk.size], (x, y)=>{
            coordVect.x = x;
            coordVect.y = y;
            globalTileCoordVect =this.chunk.globalTileOrigin.add( coordVect );

            self.chunk.getObject( x, y ).payload.tile.sprite.t3_drawRoutine( self.chunk, coordVect, globalTileCoordVect );
        });
        this.firstRenderDone = true;
        this.chunk.world.increaseRenderedChunks();
    }

    /**
     * Draws unrendered tiles, usually new ones seperate from drawFirst
     */
    drawUnrendered(){
        var self = this;
        while( self.tilesNeedRendering.length != 0 ){
            var node = self.tilesNeedRendering.pop(),
                coordVect = node.position,
                globalTileCoordVect = this.chunk.globalTileOrigin.add( coordVect );
            node.tile.sprite.t3_drawRoutine( self.chunk, coordVect, globalTileCoordVect );
        }
    }

     /**
     * Draw dynamic tiles
     */
    drawDynamic(){
        var self = this;
        Object.keys( this.chunk.dynamicTilesKeys ).map( ( key )=>{
            var node = this.chunk.dynamicTiles[ key ];
            node.tile.sprite.t3_drawRoutine( self.chunk, node.position, self.chunk.globalTileOrigin.add( node.position ) );
        });
    }

    // Updates a single neighbour dependent tile
    drawNeighbourDependent(){
        if(this.chunk.neighbourDependentTilesKeys.length == 0){return;}
        var node = this.chunk.neighbourDependentTiles[ this.chunk.neighbourDependentTilesKeys[ this.drawCalls % this.chunk.neighbourDependentTilesKeys.length ]];
        node.tile.sprite.t3_drawRoutine( this.chunk, node.position, this.chunk.globalTileOrigin.add( node.position ) );
    }

}

/* File source: ../src/Ambitious_Dwarf///src/sprites/sprite.js */
class Sprite extends Actor{
    constructor(){
		super("sprite");
        this.source = TSINTERFACE.spritesheet.grounds;
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

/* File source: ../src/Ambitious_Dwarf///src/engine/render/spritedefs.js */
var SSPlaceholders = new Spritesheet( createSource.img( "src/assets/placeholder-atlas.png" ), 16, tilesheetReadyCheck );
var SSDFDefault = new Spritesheet( createSource.img( "src/assets/DF/03.png" ), 16, tilesheetReadyCheck );
var SSGrounds = new Spritesheet( createSource.img( "src/assets/grounds.png" ), 16, tilesheetReadyCheck );
var SSPlants1 = new Spritesheet( createSource.img( "src/assets/bush1.png" ), 16, tilesheetReadyCheck );
var SSPeople1 = new Spritesheet( createSource.img( "src/assets/people1.png" ), 4, tilesheetReadyCheck );
var SSObjects = new Spritesheet( createSource.img( "src/assets/objects.png" ), 16, tilesheetReadyCheck );
var SSFloors = new Spritesheet( createSource.img( "src/assets/floors.png" ), 16, tilesheetReadyCheck );
var SSWalls = new Spritesheet( createSource.img( "src/assets/walls.png" ), 16, tilesheetReadyCheck );
var SSDrone = new Spritesheet( createSource.img( "src/assets/drone.png" ), 16, tilesheetReadyCheck );
var SSLMFAO = new Spritesheet( createSource.img( "src/assets/lmfao/lmfaolux.png" ), 16, tilesheetReadyCheck );

TSINTERFACE.spritesheet = {
	placeholders: SSPlaceholders,
	DFDefault: SSDFDefault,
	grounds: SSGrounds,
	plants1: SSPlants1,
	people1: SSPeople1,
	objects: SSObjects,
	floors: SSFloors,
	walls: SSWalls,
	drone: SSDrone,
	LMFAO: SSLMFAO
};

// SSPlaceholders
SSPlaceholders.addTile("sprite-missing-tile-sprite", new Vector(0,0));
SSPlaceholders.addTile("sprite-missing-entity-sprite", new Vector(0,1));
SSPlaceholders.addTile("sprite-missing-sprite", new Vector(0,2));
SSPlaceholders.addTile("sprite-blank", new Vector(0,3));

// SSGrounds
SSGrounds.addTile("sprite-grass0", new Vector(0,0));
SSGrounds.addTile("sprite-grass1", new Vector(0,1));
SSGrounds.addTile("sprite-grass2", new Vector(0,2));
SSGrounds.addTile("sprite-grass-shadow0", new Vector(0,3));
SSGrounds.addTile("sprite-grass-shadow1", new Vector(0,4));
SSGrounds.addTile("sprite-stone", new Vector(0,5));
SSGrounds.addTile("sprite-water", new Vector(0,6));
SSGrounds.addTile("sprite-sand", new Vector(0,7));

// SSFloors
SSFloors.addTile("atlas-stockpile", new Vector(0,0));
SSFloors.addTile("atlas-sand", new Vector(3,0));
SSFloors.addTile("atlas-wood-path", new Vector(6,0));
SSFloors.addTile("atlas-water", new Vector(9,0));

/* File source: ../src/Ambitious_Dwarf///src/sprites/entitysprite/entitysprite.js */
class EntitySprite extends PrerenderableSprite{
	constructor(entity){
		super( true );

		if(Object.isUndefined( entity )){ throw "Error, tried constructing EntitySprite with no entity linked"; }
		this.entity = entity;

		this.source = TSINTERFACE.spritesheet.placeholders;
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
        return new PlanarRangeVector( ...TSINTERFACE.VCTSH.convertGPtoSP(this.entity.globalPixelPosition.add( TSINTERFACE.viewContext.pixelOffset ).add(this.spriteShift).add(this.entity.globalPixelPosition)).values, ...this.spriteSize.scale( TSINTERFACE.VCTSH.coefficient ).values );
    }

	t3_drawRoutine(){
		var pCoordVect = this.entity.globalPixelPosition.add( TSINTERFACE.viewContext.pixelOffset ).add(this.spriteShift);
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
		ctx.drawImage( TSINTERFACE.canvases.ground, ...region.values, 0, 0, region.width, region.height );
		ctx.drawImage( TSINTERFACE.canvases.overflow, ...region.values, 0, 0, region.width, region.height );
		ctx.drawImage( TSINTERFACE.canvases.entities, ...region.values, 0, 0, region.width, region.height );
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

/* File source: ../src/Ambitious_Dwarf///src/sprites/entitysprite/person.js */
class EntitySpritePerson extends EntitySprite{
	constructor( entity ){
		super( entity );
		this.source = TSINTERFACE.spritesheet.people1;
		this.shadowSpriteSize = new Vector( 8, 16 );
		this.shadowOffset = new Vector( -3, 2 );
		this.shadowKey = this.source.getSpriteAt( 0,8 );
		//this.spriteKey = new Vector();
		this.spriteSize = new Vector( 4, 16 );
    }
    
    get getDrawRegion(){
        return new PlanarRangeVector(
            ...this.wPixelCoordVect.add(this.entity.attributes.pixelLocation).add(this.shadowOffset.scale( TSINTERFACE.VCTSH.coefficient )).values,
            ...this.spriteSize.add(this.shadowSpriteSize.add(this.shadowOffset)).subtract(new Vector(0,16)).scale( TSINTERFACE.VCTSH.coefficient ).values );
    }

	t3_draw_shadow( pCoordVect ){
		this.source.drawPartialSprite(
			TSINTERFACE.CVSCTX.entities,
			this.shadowKey,
			...this.shadowSpriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ).add(this.shadowOffset.scale(TSINTERFACE.VCTSH.coefficient)),
			...this.shadowSpriteSize.scale( TSINTERFACE.VCTSH.coefficient ).values
		);
	}

	t3_draw( pCoordVect ){
		var actionKey = `t3_draw_${this.entity.actionName}`;
		if( !this[actionKey] ){ actionKey = `t3_draw_idle`; }
		this[actionKey]( pCoordVect );
	}

	t3_draw_idle( pCoordVect ){
		// Location of sprite as a product of ~~time~~ ticks
		var spriteKey = Math.floor( this.entity.tick/4 ) % 2;
		var direction = this.entity.tilePositionDiff.x >= 0 ? 0 : 8;
		this.t3_draw_shadow( pCoordVect );
		this.source.drawPartialSprite(
			TSINTERFACE.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey + direction ),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect,
			...this.spriteSize.scale( TSINTERFACE.VCTSH.coefficient ).values
		);
	}

	t3_draw_walk( pCoordVect ){
		var spriteKey = Math.floor( this.entity.tick/4 ) % 4;
		var direction = this.entity.tilePositionDiff.x > 0 ? 0 : 8;
		this.t3_draw_shadow( pCoordVect );
		this.source.drawPartialSprite(
			TSINTERFACE.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey+4  + direction),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ),
			...this.spriteSize.scale( TSINTERFACE.VCTSH.coefficient ).values
		);
	}
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/tilesprite.js */
/**
 * Simple tiles
 */
class TileSprite extends PrerenderableSprite{
	constructor( tile, tileSpriteSource = TSINTERFACE.spritesheet.placeholders, tileSpriteKey = new Vector(0,0) ){
		super();
		this.tile = tile;
		this.width = cfg.tile_size;
		this.height = cfg.tile_size;
		
		// Sprite source and the key to the sprite if the sprite is static
		this.source = tileSpriteSource;
		this.sourceKey = tileSpriteKey;

		this.defaultStaticGroundLocation = TSINTERFACE.spritesheet.grounds.getTileAt(0,0);
		// Other stuff
		this.staticSpriteLocation = this.source.getSpriteAt( 1, 0 );
		this.staticGroundSource = TSINTERFACE.spritesheet.grounds;
		this.staticGroundLocation = this.defaultStaticGroundLocation;
		this.spritePixelOffset = new Vector( 0,2 );	// The offset of a sprite
		this.spritePixelOverflowOffset = this.calculateOverflowOffset(); // This is what Chunk.canvasOverflow is for
	}

	calculateOverflowOffset(){
        return new Vector( 0, cfg.tile_size - this.spritePixelOffset.y );
    }

	t3_prerender( chunk, coordVect, globalTileCoordVect ){

	}

	/**
	 * Draws an icon for the tilesprite
	 * Used within gui
	 * @param {HTMLCanvas2dContext} canvasCtx 
	 */
	draw_icon( canvasCtx ){
		this.source.drawTile(
			canvasCtx,
			this.sourceKey,
			new Vector(0,0),
			28, 28
		);
	}

	/**
	 * Memory efficent drawRoutine<br>
	 * Thought: Instead of creating a TileSprite instance for each instance of a tile,
	 * 			Why not create one one TileSprite instance that will be used by the same tile?<br>
	 *			<img src="https://i.imgur.com/EUCHdNr.png" width="100px"><br>
	 * Implementations of t4 assumes 2 things:<br>
	 * 		1) the tilesprite is defined in a global scope<br>
	 * 		2) tiledata will derrive from the tile passed through the function
	 * @param {Tile} tile 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} tCoordVect Chunk relative tile coordinates
	 * @param {CoordinateVector} gtCoordVect Global tile coordinates
	 */
	t4_drawRoutine( tile, chunk, tCoordVect, gtCoordVect ){
		return;
	}

	/**
	 * 
	 * @param {*} chunk 
	 * @param {*} coordVect 
	 * @param {*} globalTileCoordVect 
	 */
	t3_drawRoutine( chunk, coordVect, globalTileCoordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.t3_clearRenderingSpace(chunk, coordVect);

		if( this.needsPrerender && !this.isPrerendered && PrerenderingStats.ready ){
			this.t3_prerender( chunk, pCoordVect, globalTileCoordVect );
		}
		this.t3_draw( chunk, pCoordVect, globalTileCoordVect );
    }


	/**
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates, if that's important
	 */
	t3_draw( chunk, pCoordVect, globalTileCoordVect ){
		this.source.drawTile(
			chunk.renderer.canvasCtx,
			this.sourceKey,
			pCoordVect,
			cfg.tile_size, cfg.tile_size
		);
		//this.t3_drawGround(chunk, pCoordVect );
	}

	/**
	 * A simple helper to draw the ground for non-solid tiles
	 * @param {Chunk} chunk Chunk
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_drawGround( chunk, pCoordVect ){
		this.staticGroundSource.drawTile(
			chunk.renderer.canvasCtx,
			this.staticGroundLocation,
			pCoordVect,
			cfg.tile_size, cfg.tile_size
		);
	}

	/**
	 * Draw a sprite that uses layers
	 * @param {Tilesheet} source 
	 * @param {Chunk} chunk 
	 * @param {CooedinateVector} tileLocation 
	 * @param {Vector} spritePixelOffset 
	 * @param {Vector} spritePixelOverflowOffset 
	 * @param {CoordinateVector} pCoordVect 
	 */
	static drawLayeredTile( source, chunk, tileLocation, spritePixelOffset, spritePixelOverflowOffset, pCoordVect ){
		source.drawPartialTile(
            chunk.renderer.canvasCtx,
            tileLocation.add( spritePixelOffset ),
            cfg.tile_size, spritePixelOverflowOffset.y,
            pCoordVect,
            cfg.tile_size, spritePixelOverflowOffset.y
		);
        source.drawPartialTile(
            chunk.renderer.canvasOverflowCtx,
            tileLocation,
            cfg.tile_size, spritePixelOffset.y,
            pCoordVect.add( spritePixelOverflowOffset ),
            cfg.tile_size,spritePixelOffset.y
		);
	}

	/**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative tile coordinates
	 */
	t3_clearRenderingSpace( chunk, coordVect ){
		var pCoordVect = coordVect.scale( cfg.tile_size );
		this.t3_clearGround( chunk, pCoordVect );
		this.t3_clearOverflow( chunk, pCoordVect )
	}

	/**
	 * 
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} pCoordVect Pixel coordinates
	 */
	t3_clearOverflow( chunk, pCoordVect ){
		var ctx = chunk.renderer.canvasOverflowCtx;
		ctx.clearRect( pCoordVect.x, pCoordVect.y, cfg.tile_size, cfg.tile_size );
	}
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/nonsolid.js */
class TileSpriteNonSolid extends TileSprite{
	constructor( ...args ){
		super(...args);
	}

	/**
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates, if that's important
	 */
	t3_draw( chunk, pCoordVect, globalTileCoordVect ){
		this.t3_drawGround(chunk, pCoordVect );
		this.source.drawTile(
			chunk.renderer.canvasCtx,
			this.sourceKey,
			pCoordVect,
			cfg.tile_size, cfg.tile_size
		);
	}
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/bush.js */
class TileSpriteBush extends TileSprite{
    constructor( tile ){
        super( tile );
        this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
        this.source = TSINTERFACE.spritesheet.plants1;
        this.staticSpriteLocation = this.source.getTileAt( 0, 0 );
        this.staticGroundLocation = TSINTERFACE.spritesheet.grounds.getTileAt(0,3);
        this.spritePixelOffset = new Vector( 0,2 );
        this.spritePixelOverflowOffset = this.calculateOverflowOffset();

        // Prerendering stuff
		this.prerenderWidth = cfg.tile_size;
		this.prerenderHeight = cfg.tile_size;
		this.needsPrerender=false;	// Set to true for tiles that need pre-rendering
		this.isPrerendered=false;
        this.hasDepth=false;		// If the tile sprite occupies more than a single tile-space
        
        this.bushSpriteIndex = 0;
        this.bushSpriteCount = 0;
    }

    t3_draw( chunk, pCoordVect ){
        var randomSprite = Math.floor(Math.random()* 3),    
            randomSpriteLocation = this.source.getTileAt( this.bushSpriteIndex, randomSprite );
        
        this.t3_drawGround( chunk, pCoordVect );
        TileSprite.drawLayeredTile( this.source, chunk, randomSpriteLocation, this.spritePixelOffset, this.spritePixelOverflowOffset, pCoordVect );
    }
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/grass.js */
class TileSpriteGrass extends TileSprite{
	constructor( tile ){
        super( tile );
        this.source = SSGrounds;
		this.spritePixelOffset = new Vector( 0,4 );	// The offset of a sprite
        this.spritePixelOverflowOffset = this.calculateOverflowOffset(); // This is what Chunk.canvasOverflow is for
	}

	t3_draw( chunk, pCoordVect ){
		// Ground Grass tile
		if( Math.random() < 0.05){
			this.staticGroundLocation = this.source.getTileAt(0,1+Math.floor(Math.random()*2));
		}else{
			this.staticGroundLocation = this.defaultStaticGroundLocation;
		}
		this.t3_drawGround( chunk, pCoordVect );

        if(!cfg.render_decals){return;}
		// Decals
		var randomSprite, randomSpriteLocation;
		if( false && Math.random() < 0.05){
			// Big plants
			randomSprite= Math.floor(Math.random()* 6);
			this.staticGroundLocation = TSINTERFACE.spritesheet.grounds.getTileAt(0,4);
            randomSpriteLocation = TSINTERFACE.spritesheet.plants1.getTileAt( 1, randomSprite );
			TileSprite.drawLayeredTile( TSINTERFACE.spritesheet.plants1, chunk, randomSpriteLocation, this.spritePixelOffset, this.spritePixelOverflowOffset, pCoordVect );
		}else{
			// Grass overlays
			randomSprite= Math.floor(Math.random()* 6);
			randomSpriteLocation = TSINTERFACE.spritesheet.plants1.getTileAt( 4, randomSprite );
			TSINTERFACE.spritesheet.plants1.drawTile(
				chunk.renderer.canvasOverflowCtx,
				randomSpriteLocation,
				pCoordVect,
				cfg.tile_size, cfg.tile_size
			);
		}
	}
}


/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/neighbourdependent.js */
class TileSpriteNeighbourDependent extends TileSprite{
    constructor( tile, source, atlasKey = new Vector(0,0) ){
        super( tile );
        this.source = source ? source : this.source;
        this.atlasKey = atlasKey;
        this.sourceKey = this.source.getSpriteAt( 2,3 ).add(atlasKey);
        this.tile.isNeighbourDependent = true;
    }

    neighbourCondition( tile ){
        return tile.identityString == this.tile.identityString;
    }

    static get spriteConfigs(){
        return {
            "single":[2,3],
            "corner_top_left":[0,0],
            "corner_top_right":[0,2],
            "corner_bottom_left":[2,0],
            "corner_bottom_right":[2,2],
            "junction_top_left_right":[2,1],
            "junction_bottom_left_right":[0,1],
            "horizontal":[1,3],
            "vertical":[0,3],
            "junction_left_top_bottom":[1,2],
            "junction_right_top_bottom":[1,0],
            "junction_t":[1,1],
            "end_right":[1,4],
            "end_top":[0,4],
            "end_bottom":[0,5],
            "end_left":[1,5]
        };
    }

    static get adjacentSpriteMap(){
        return {
            "0101":"horizontal",
            "1010":"vertical",
            "0011":"corner_top_right",
            "0110":"corner_top_left",
            "1100":"corner_bottom_left",
            "1001":"corner_bottom_right",
            "1111":"junction_t",
            "1101":"junction_top_left_right",
            "0111":"junction_bottom_left_right",
            "1011":"junction_left_top_bottom",
            "1110":"junction_right_top_bottom",
            "1000":"end_bottom",
            "0100":"end_left",
            "0010":"end_top",
            "0001":"end_right"
        };
    }

    t3_draw( chunk, pCoordVect, globalTileCoordVect ){
        this.t3_drawGround( chunk, pCoordVect );
        this.source.drawTile(
            chunk.renderer.canvasCtx,
            this.t3_getTileSpriteLocation( globalTileCoordVect ),
            pCoordVect,
            cfg.tile_size,cfg.tile_size);
    }

    t3_getTileSpriteLocation( globalTileCoordVect ){
        var neighbours = Tile.neighbours,
            tilesheet = this.source,
            spriteMapKey = this.t3_getSpriteMapKey( globalTileCoordVect );

        // If there is a sprite configuration defined
        var spriteConfigKey = this.constructor.adjacentSpriteMap[ spriteMapKey ];
        
        if( spriteConfigKey ){
    
            return tilesheet.getTileAt( ...this.constructor.spriteConfigs[ spriteConfigKey ] ).add(this.atlasKey);
        }
        return tilesheet.getTileAt( ...this.constructor.spriteConfigs.single ).add(this.atlasKey);
    }
    // Updated behavour for tiles that don't exist ( out of bounds tiles )
    t3_getSpriteMapKey( globalTileCoordVect ){
        return Tile.neighbours.map( ( offsetVector )=>{
            var neighbour = globalTileCoordVect.add( offsetVector ),
                neighbourTileObject = TSINTERFACE.World.getTile( neighbour.x, neighbour.y );
            // Unknown tiles
            if(!neighbourTileObject){return 1;}
            return this.neighbourCondition( neighbourTileObject ) ? 1 : 0;
        }).join('');
    }
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/metaneighdep.js */
class TileSpriteMetaNeighbourDependent extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey = new Vector(0,0) ){
        super( tile, source, atlasKey );
    }

    t3_getSpriteMapKey( globalTileCoordVect ){
        return Tile.neighbours.map( ( offsetVector, index )=>{
            var neighbour = globalTileCoordVect.add( offsetVector ),
                neighbourTileObject = TSINTERFACE.World.getTile( neighbour.x, neighbour.y );
            if(!neighbourTileObject){return 0;}
            if( index==2 && neighbourTileObject.meta != this.tile.meta){
                var thisElevation = TSINTERFACE.World.generation.getElevationAt(globalTileCoordVect.x, globalTileCoordVect.y),
                    belowElevation = TSINTERFACE.World.generation.getElevationAt(neighbour.x, neighbour.y);
                if( thisElevation<=belowElevation ){
                    return 1;
                }
            }
            return this.neighbourCondition( neighbourTileObject ) ? 1 : 0;
        }, this).join('');
    }
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/wall.js */


class TileSpriteWall extends TileSpriteNeighbourDependent{
    constructor( tile ){
        super( tile );
        this.spriteLocation = null;
        this.requestSpriteUpdate = true;
        this.source = TSINTERFACE.spritesheet.walls;
        this.atlasKey = new Vector(0,0);
    }

    neighbourCondition( tile ){
        return tile.isWall;
    }
    /*
    static get spriteConfigs(){
        return {
            "single":[12,7],
            "corner_top_left":[12,9],
            "corner_top_right":[11,11],
            "corner_bottom_left":[12,8],
            "corner_bottom_right":[11,12],
            "junction_top_left_right":[12,10],
            "junction_bottom_left_right":[12,11],
            "horizontal":[12,13],
            "vertical":[11,10],
            "junction_left_top_bottom":[11,9],
            "junction_right_top_bottom":[12,12],
            "junction_t":[12,14]
        };
    }

    static get adjacentSpriteMap(){
        return {
            "0101":"horizontal",
            "1010":"vertical",
            "0011":"corner_top_right",
            "0110":"corner_top_left",
            "1100":"corner_bottom_left",
            "1001":"corner_bottom_right",
            "1111":"junction_t",
            "1101":"junction_top_left_right",
            "0111":"junction_bottom_left_right",
            "1011":"junction_left_top_bottom",
            "1110":"junction_right_top_bottom"
        };
    }
    */

}


/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/sand.js */
class TileSpriteSand extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey ){
        super( tile, source, atlasKey );
    }

    neighbourCondition( tile ){
        return tile.identityString == this.tile.identityString || tile.hasIdentity("water");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/water.js */
class TileSpriteWater extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey ){
        super( tile, source, atlasKey );
        this.staticGroundLocation = SSGrounds.getTile("sprite-sand");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/sprites/tilesprite/stockpile.js */
class TileSpriteStockpile extends TileSpriteNeighbourDependent{
    constructor( tile ){
        super( tile );
        this.source = TSINTERFACE.spritesheet.floors;
        this.sourceKey = this.source.getSpriteAt(2,3);
        this.atlasKey = this.source.getSpriteAt(0,0);
    }
}

