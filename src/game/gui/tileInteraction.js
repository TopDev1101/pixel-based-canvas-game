/**
 * 1000 0000
 * 0000 0000
 * 0000 0000
 * 0000 0000
 */
/**
 * Tile interaction Definition
 * Maps each pixel of a tile to a value which determines the interactions an entity can have within a tile
 */
class TileInteractionDefinition{
    /**
     * 
     * @param {Tilesheet} tileInteractionTilesheet A complementary tilesheet which uses colors to define interactions an entity can take
     * @param {Vector} tileLocation 
     */
    constructor( tileInteractionTilesheet, tileLocation ){
        var self = this;
        this.canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d");
        this.ctx.drawImage( tileInteractionTilesheet.src, ...tileLocation.values, 0, 0, cfg.tile_size, cfg.tile_size );
        this.pixelRules = {};
        // Iterate though all pixels
        nestedLoop( [0,0], [cfg.tile_size, cfg.tile_size], ( x, y )=>{
            var data = self.canvas.getImageData( x, y, 1, 1 );
            self.computePixelRules( x, y, data );
        });
    }

    computePixelRules( x, y, rulesetR, rulesetG, rulesetB, rulesetA ){
        // Creates a 32 bit integer 
        this.pixelRules[x+"_"+y] = ((((((0x80 | rulesetR) << 8 ) | rulesetG) << 8 ) | rulesetB) << 8 ) | rulesetA;
    }
}