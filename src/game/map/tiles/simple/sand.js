/**
 * Sand tile
 * This is the first implementaion of 0 depth spritesheet globals
 */
class TileSand extends Tile{
    constructor(){
        super();
        this.sprite = new TileSpriteSand( this, SSFloors, SSFloors.getTile("atlas-sand") );
        this.addIdentity("sand");
    }
}