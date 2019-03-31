class TileStone extends Tile{
    constructor( meta=0 ){
        super();
        // Todo fix sprites for meta
        this.meta = meta;
        this.sprite = new TileSpriteMetaNeighbourDependent( this,
            TSINTERFACE.spritesheet.walls, TSINTERFACE.spritesheet.walls.getSpriteAt(6,0) );
        this.sprite.staticGroundLocation = this.sprite.staticGroundSource.getSpriteAt(0,0); // 0,5 for stone floor
        this.isObstacle = true;
        this.addIdentity("stone");
        this.addIdentity(`meta${meta}`)
    }
}