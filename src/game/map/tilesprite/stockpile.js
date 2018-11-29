class TileSpriteStockpile extends TileSpriteNeighbourDependent{
    constructor( tile ){
        super( tile );
        this.source = Townsend.spritesheet.floors;
        this.sourceKey = this.source.getSpriteAt(2,3);
        this.atlasKey = this.source.getSpriteAt(0,0);
    }
}