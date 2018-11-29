class TileSpriteWater extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey ){
        super( tile, source, atlasKey );
        this.staticGroundLocation = SSGrounds.getTile("sprite-sand");
    }
}