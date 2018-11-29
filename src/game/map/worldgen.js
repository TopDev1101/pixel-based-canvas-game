const SIMPLEX_NOISE = require("simplex-noise");
class WorldGen{
    constructor( seed = "" ){
        this.seed = seed;
        this.elevationNoise = new SIMPLEX_NOISE( this.seed+"stone" );
    }

    /**
     * Gets the tile elevation at (x,y)
     * @param {Number} x Global tile coordinates
     * @param {Number} y Global tile coordinates
     */
    getElevationAt( x, y ){
        return this.elevationNoise.noise2D( x * cfg.generation_elevationCoefficient_x, y * cfg.generation_elevationCoefficient_y );
    }
}