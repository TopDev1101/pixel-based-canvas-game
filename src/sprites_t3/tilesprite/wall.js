

class TileSpriteWall extends TileSpriteNeighbourDependent{
    constructor( tile ){
        super( tile );
        this.spriteLocation = null;
        this.requestSpriteUpdate = true;
        this.source = TSINTERFACE.spritesheet.walls;
        this.atlasKey = new Vector(0,0);
    }

    neighbourCondition( tile ){
        return tile.isWall;
    }
    /*
    static get spriteConfigs(){
        return {
            "single":[12,7],
            "corner_top_left":[12,9],
            "corner_top_right":[11,11],
            "corner_bottom_left":[12,8],
            "corner_bottom_right":[11,12],
            "junction_top_left_right":[12,10],
            "junction_bottom_left_right":[12,11],
            "horizontal":[12,13],
            "vertical":[11,10],
            "junction_left_top_bottom":[11,9],
            "junction_right_top_bottom":[12,12],
            "junction_t":[12,14]
        };
    }

    static get adjacentSpriteMap(){
        return {
            "0101":"horizontal",
            "1010":"vertical",
            "0011":"corner_top_right",
            "0110":"corner_top_left",
            "1100":"corner_bottom_left",
            "1001":"corner_bottom_right",
            "1111":"junction_t",
            "1101":"junction_top_left_right",
            "0111":"junction_bottom_left_right",
            "1011":"junction_left_top_bottom",
            "1110":"junction_right_top_bottom"
        };
    }
    */

}
