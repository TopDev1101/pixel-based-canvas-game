/* File source: ../src/Ambitious_Dwarf///src/game/render/sprite.js */
class Sprite{
    constructor(){
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

/* File source: ../src/Ambitious_Dwarf///src/game/entity/sprite/entitysprite.js */
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

/* File source: ../src/Ambitious_Dwarf///src/game/entity/sprite/person.js */
class EntitySpritePerson extends EntitySprite{
	constructor( entity ){
		super( entity );
		this.source = Townsend.spritesheet.people1;
		this.shadowSpriteSize = new Vector( 8, 16 );
		this.shadowOffset = new Vector( -3, 2 );
		this.shadowKey = this.source.getSpriteAt( 0,8 );
		//this.spriteKey = new Vector();
		this.spriteSize = new Vector( 4, 16 );
    }
    
    get getDrawRegion(){
        return new PlanarRangeVector(
            ...this.wPixelCoordVect.add(this.entity.attributes.pixelLocation).add(this.shadowOffset.scale( Townsend.VCTSH.coefficient )).values,
            ...this.spriteSize.add(this.shadowSpriteSize.add(this.shadowOffset)).subtract(new Vector(0,16)).scale( Townsend.VCTSH.coefficient ).values );
    }

	t3_draw_shadow( pCoordVect ){
		this.source.drawPartialSprite(
			Townsend.CVSCTX.entities,
			this.shadowKey,
			...this.shadowSpriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ).add(this.shadowOffset.scale(Townsend.VCTSH.coefficient)),
			...this.shadowSpriteSize.scale( Townsend.VCTSH.coefficient ).values
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
			Townsend.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey + direction ),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect,
			...this.spriteSize.scale( Townsend.VCTSH.coefficient ).values
		);
	}

	t3_draw_walk( pCoordVect ){
		var spriteKey = Math.floor( this.entity.tick/4 ) % 4;
		var direction = this.entity.tilePositionDiff.x > 0 ? 0 : 8;
		this.t3_draw_shadow( pCoordVect );
		this.source.drawPartialSprite(
			Townsend.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey+4  + direction),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ),
			...this.spriteSize.scale( Townsend.VCTSH.coefficient ).values
		);
	}
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/tilesprite.js */
/**
 * Simple tiles
 */
class TileSprite extends PrerenderableSprite{
	constructor( tile, tileSpriteSource = Townsend.spritesheet.placeholders, tileSpriteKey = new Vector(0,0) ){
		super();
		this.tile = tile;
		this.width = cfg.tile_size;
		this.height = cfg.tile_size;
		
		// Sprite source and the key to the sprite if the sprite is static
		this.source = tileSpriteSource;
		this.sourceKey = tileSpriteKey;

		this.defaultStaticGroundLocation = Townsend.spritesheet.grounds.getTileAt(0,0);
		// Other stuff
		this.staticSpriteLocation = this.source.getSpriteAt( 1, 0 );
		this.staticGroundSource = Townsend.spritesheet.grounds;
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

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/nonsolid.js */
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

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/bush.js */
class TileSpriteBush extends TileSprite{
    constructor( tile ){
        super( tile );
        this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
        this.source = Townsend.spritesheet.plants1;
        this.staticSpriteLocation = this.source.getTileAt( 0, 0 );
        this.staticGroundLocation = Townsend.spritesheet.grounds.getTileAt(0,3);
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

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/neighbourdependent.js */
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
                neighbourTileObject = Townsend.World.getTile( neighbour.x, neighbour.y );
            // Unknown tiles
            if(!neighbourTileObject){return 1;}
            return this.neighbourCondition( neighbourTileObject ) ? 1 : 0;
        }).join('');
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/metaneighdep.js */
class TileSpriteMetaNeighbourDependent extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey = new Vector(0,0) ){
        super( tile, source, atlasKey );
    }

    t3_getSpriteMapKey( globalTileCoordVect ){
        return Tile.neighbours.map( ( offsetVector, index )=>{
            var neighbour = globalTileCoordVect.add( offsetVector ),
                neighbourTileObject = Townsend.World.getTile( neighbour.x, neighbour.y );
            if(!neighbourTileObject){return 0;}
            if( index==2 && neighbourTileObject.meta != this.tile.meta){
                var thisElevation = Townsend.World.generation.getElevationAt(globalTileCoordVect.x, globalTileCoordVect.y),
                    belowElevation = Townsend.World.generation.getElevationAt(neighbour.x, neighbour.y);
                if( thisElevation<=belowElevation ){
                    return 1;
                }
            }
            return this.neighbourCondition( neighbourTileObject ) ? 1 : 0;
        }, this).join('');
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/wall.js */


class TileSpriteWall extends TileSpriteNeighbourDependent{
    constructor( tile ){
        super( tile );
        this.spriteLocation = null;
        this.requestSpriteUpdate = true;
        this.source = Townsend.spritesheet.walls;
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


/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/sand.js */
class TileSpriteSand extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey ){
        super( tile, source, atlasKey );
    }

    neighbourCondition( tile ){
        return tile.identityString == this.tile.identityString || tile.hasIdentity("water");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/water.js */
class TileSpriteWater extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey ){
        super( tile, source, atlasKey );
        this.staticGroundLocation = SSGrounds.getTile("sprite-sand");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/map/tilesprite/stockpile.js */
class TileSpriteStockpile extends TileSpriteNeighbourDependent{
    constructor( tile ){
        super( tile );
        this.source = Townsend.spritesheet.floors;
        this.sourceKey = this.source.getSpriteAt(2,3);
        this.atlasKey = this.source.getSpriteAt(0,0);
    }
}

