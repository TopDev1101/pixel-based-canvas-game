/**
 * Water tile
 */
class TileWater extends Tile{
    constructor(){
        super();
        this.sprite = new TileSpriteWater( this, SSFloors, SSFloors.getTile("atlas-water") );
        this.addIdentity("water");
    }
}