class TileDebugFNSUD extends Tile{
    /**
     * Force neighbour sprite update
     */
    constructor(){
        super();
    }

    get isBuildable(){ return true; }
    get isDebug(){ return true; }
    get name(){ return "force neighbour sprite update"; }

    on_placed( gCoordVect, world ){
		if(!this.world){this.world = world;}
        var position = gCoordVect;
        TSINTERFACE.neighbourMergedOffsetVectorList.map( ( offsetVector )=>{
            var neighbourLocation = position.add(offsetVector);
            if( this.world.tileExists(...neighbourLocation.values)){
				var extendedTileData = this.world.getTilePlus( ...neighbourLocation.values );
				extendedTileData.chunk.markTileForRendering( extendedTileData.tile, extendedTileData.chunkRelPosition );
            }
        });
    }
}