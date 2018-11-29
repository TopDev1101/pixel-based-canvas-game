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