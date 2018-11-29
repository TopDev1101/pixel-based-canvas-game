class TileStockpile extends StorageTile{
    constructor(){
        super();
        this.isNeighbourDependent = true;
        this.sprite = new TileSpriteStockpile( this );
        //this.sprite = new TileSpriteNonSolid( this, Townsend.spritesheet.objects, Townsend.spritesheet.objects.getSpriteAt( 0, 3 ) );
        this.isSpecialTile = true;
        this.addIdentity("stockpile");
    }
    get name(){ return "Stockpile"; }
    get isBuildable(){return true;}

    get isFull(){
        return this.items == this.maxItemAmount;
    }
}