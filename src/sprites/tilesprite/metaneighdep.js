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