class TileStone extends Tile{
    constructor( meta=0 ){
        super();
        // Todo fix sprites for meta
        this.meta = meta;
        this.sprite = new TileSpriteMetaNeighbourDependent( this,
            Townsend.spritesheet.walls, Townsend.spritesheet.walls.getSpriteAt(3,0) );
        this.sprite.staticGroundLocation = this.sprite.staticGroundSource.getSpriteAt(0,5);
        this.isObstacle = true;
        this.addIdentity("stone");
        this.addIdentity(`meta${meta}`)
    }
}