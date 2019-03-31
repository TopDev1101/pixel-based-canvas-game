

class ChunkActor extends Actor{
    constructor(world, size, positionVector){
        super("chunk");
        this.chunk = new Chunk( world, size, positionVector );
        this.addIdentity(positionVector.toString());
    }
}

class Chunk{
    constructor( world, size, positionVector ){
        this.tileMap = new TileMap( size, {tile:TSINTERFACE.tiles.grass, metadata:{}} );
        this.position = positionVector;
        this.size = size;
        this.world = world;
        this.entities = [];
        this.globalTileOrigin = this.position.scale( this.size  );

        // Iterative access of tiles that use unique intervals of sprite updates
        this.uniqueTileCases.map(( goodName )=>{ // Super good name!
            this[goodName.ref] = {};
            this[goodName.ref+"Keys"] = [];
        }, this);

        this.renderer = new ChunkRenderer( this );
    }

    get uniqueTileCases(){
        return [
            {prop:"isSpecial", ref:"specialTiles"},
            {prop:"isDynamic", ref:"dynamicTiles"},
            {prop:"isNeighbourDependent", ref:"neighbourDependentTiles"},
            {prop:"isTickDependant", ref:"tickDependantTiles"},
        ]
    }

    chunkRelCoordsToGlobalRelCoords( tCoordVect ){
        return tCoordVect.add( this.position.scale( this.size ) );
    }

    /**
     * 
     * @param {Number} tick total ticks 
     */
    update( tick ){

    }

    createPayload( tile, metadata ){
        return {tile:tile, metadata:metadata}
    }

    placeTile( tile, x, y ){
        var location = new Vector(x, y);

        var occupiedNode = this.tileMap.getObject( x, y );
        if( occupiedNode ){
            occupiedNode.payload.tile.sprite.t3_clearRenderingSpace( this, location );
        }

        this.tileMap.placeObject( x, y, this.createPayload( tile, tile.defaultMetadata ) ); /// Haha what
        this.assignToLabels( tile, location );

        this.markTileForRendering( tile, location );
        
        this.updateKeys();

        tile.eventEmitter.emit( "placed", tile, this.chunkRelCoordsToGlobalRelCoords( location ), this.world );
    }

    /**
     * UNSAFE, gets a tile, assumes the tile exists.
     * Do not use if you are unsure about the existence of a tile,
     * or without implementing proper measures to handle a non-existent tile
     * @param {*} x 
     * @param {*} y 
     */
    getTile( x, y ){
        return ( this.tileMap.getObject( x, y ).payload || {} ).tile;
    }

    markTileForRendering( tile, location ){
        this.renderer.tilesNeedRendering.push( Chunk.createTileNode( tile, location ) );
    }

    updateKeys(){
        this.specialTilesKeys = Object.keys( this.specialTiles );
        this.dynamicTilesKeys = Object.keys( this.dynamicTiles );
        this.neighbourDependentTilesKeys = Object.keys( this.neighbourDependentTiles );
        this.tickDependantTilesKeys = Object.keys( this.tickDependantTiles );
    }

    assignToLabels( tile, location ){
        // Super good name!
        this.uniqueTileCases.map( (goodName)=>{
            if(tile[goodName.prop]){
                this[goodName.ref][location.string] = Chunk.createTileNode( tile, location );
            }
        },this );
    }

    // TODO finish
    removeObject( x, y ){
        this.tileMap.removeObject( x, y );
    }


    static createTileNode( tile, position ){
        return {position:position, tile:tile};
    }

    /**
     * Get the global position for a tile within a chunk.
     * Useful for determining where to draw a tile for batch rendering
     * @param {Number} tileX x coordinate of a tile
     * @param {Number} tileY y coordinate of a tile
     * @returns CoordinateVector
     */
    getTileGlobalPosition( tileX, tileY ){
        var xCoordinate = this.size * this.position.x + tileX + this.world.origin.x/cfg.tile_size;
        var yCoordinate = this.size * this.position.y + tileY + this.world.origin.y/cfg.tile_size;
        return new CoordinateVector( xCoordinate, yCoordinate );
    }
}