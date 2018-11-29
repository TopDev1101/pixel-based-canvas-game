class TileWall extends Tile{
    constructor(){
        super();
        this.isWall = true;
        this.isObstacle = true;
        this.isNeighbourDependent = true;
        this.sprite = new TileSpriteWall( this );

        this.addIdentity("wall");
    }
    get name(){ return "Stone Wall"; }
    get isBuildable(){return true;}
}