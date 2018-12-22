class ChunkRenderer extends Actor{
    constructor( chunk ){
        super("sprite");
        this.chunk = chunk;

        this.canvas = document.createElement("canvas");
        this.canvasCtx = this.canvas.getContext("2d");
        this.canvas.width = this.chunk.size * cfg.tile_size;
        this.canvas.height = this.chunk.size * cfg.tile_size;

        this.canvasOverflow = document.createElement("canvas");
        this.canvasOverflowCtx = this.canvasOverflow.getContext("2d");
        this.canvasOverflow.width = 16;
        this.canvasOverflow.height = 16;

        this.debug_color = new Color( Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255), 0.5 ).rgbaString;

        this.drawCalls = 0;

        this.tilesNeedRendering = [];
        this.firstRenderDone = false;
    }

    // Basically the chunk's drawn state stays static unless it's in view
    t3_drawProtocol(){
        this.drawCalls++;
        if( !cfg.debug_enable_newChunkRenders ) return;
        if( !this.firstRenderDone && TSINTERFACE.allTilesheetsLoaded ){
            this.drawFirst();
        }
        this.drawUnrendered();
        this.drawDynamic();
        //this.drawNeighbourDependent();
    }

    drawFirst(){
        this.canvasOverflow.width = this.chunk.size * cfg.tile_size;
        this.canvasOverflow.height = this.chunk.size * cfg.tile_size;
        var coordVect = new CoordinateVector(0,0),
        globalTileCoordVect = null,
            self = this;
        nestedIncriment( [0,0], [this.chunk.size, this.chunk.size], (x, y)=>{
            coordVect.x = x;
            coordVect.y = y;
            globalTileCoordVect =this.chunk.globalTileOrigin.add( coordVect );

            self.chunk.getObject( x, y ).payload.tile.sprite.t3_drawRoutine( self.chunk, coordVect, globalTileCoordVect );
        });
        this.firstRenderDone = true;
        this.chunk.world.increaseRenderedChunks();
    }

    /**
     * Draws unrendered tiles, usually new ones seperate from drawFirst
     */
    drawUnrendered(){
        var self = this;
        while( self.tilesNeedRendering.length != 0 ){
            var node = self.tilesNeedRendering.pop(),
                coordVect = node.position,
                globalTileCoordVect = this.chunk.globalTileOrigin.add( coordVect );
            node.tile.sprite.t3_drawRoutine( self.chunk, coordVect, globalTileCoordVect );
        }
    }

     /**
     * Draw dynamic tiles
     */
    drawDynamic(){
        var self = this;
        Object.keys( this.chunk.dynamicTilesKeys ).map( ( key )=>{
            var node = this.chunk.dynamicTiles[ key ];
            node.tile.sprite.t3_drawRoutine( self.chunk, node.position, self.chunk.globalTileOrigin.add( node.position ) );
        });
    }

    // Updates a single neighbour dependent tile
    drawNeighbourDependent(){
        if(this.chunk.neighbourDependentTilesKeys.length == 0){return;}
        var node = this.chunk.neighbourDependentTiles[ this.chunk.neighbourDependentTilesKeys[ this.drawCalls % this.chunk.neighbourDependentTilesKeys.length ]];
        node.tile.sprite.t3_drawRoutine( this.chunk, node.position, this.chunk.globalTileOrigin.add( node.position ) );
    }

}