
class TileGrass extends Tile{
    constructor(){
        super();
		this.addIdentity("grass");
		this.sprite = new TileSpriteGrass( this );
    }
}