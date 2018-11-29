class StorageTile extends Tile{
    constructor(){
        super();

        // Template properties
		this.isDynamic = false; // If the tile has a dynamic sprite
		this.isNeighbourDependent = false; // If the sprite state depends on it's neighbours
        this.isSolidSprite = true; // If the sprite occupies all 16x16 pixels
        this.isSpecial = true;
        
        // Physical properties
		this.isObstacle = false;

        this.addIdentity("storage");
        
        this.inventory = new Inventory( this.maxItemStack );
        
    }

    get maxItemStack(){ return 16; }
}