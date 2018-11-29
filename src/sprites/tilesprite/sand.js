class TileSpriteSand extends TileSpriteNeighbourDependent{
    constructor( tile, source, atlasKey ){
        super( tile, source, atlasKey );
    }

    neighbourCondition( tile ){
        return tile.identityString == this.tile.identityString || tile.hasIdentity("water");
    }
}