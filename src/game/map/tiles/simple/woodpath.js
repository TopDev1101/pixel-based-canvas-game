class TileWoodPath extends Tile{
    constructor(){
        super();
        this.isNeighbourDependent = true;
        this.sprite = new TileSpriteNeighbourDependent( this,
                Townsend.spritesheet.floors,
                Townsend.spritesheet.floors.getSpriteAt( 6,0 )
            );
        this.addIdentity("wood-path");
    }
    get name(){ return "Wood Path"; }
    get isBuildable(){return true;}
}