

class TileBush extends ForageableTile{
    constructor(){
        super();
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighbourDependent = false; // If the sprite state depends on it's neighbours
        this.sprite = new TileSpriteBush( this );
        this.addIdentity("bush");   
        this.isObstacle = true;
    }
}