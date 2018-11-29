/**
 * A world generation anchor defines a centerpoint for many elements of world gen
 * Such as a first position for a chain of rocks
 * or a center for a a patch of grass
 */
class WorldGenerationAnchor{
    constructor( world, x, y, weight ){
        this.generationVectors = [
            new Vector( (Math.random()*weight )-weight/2, (Math.random()*weight )-weight/2 ), 
            new Vector( (Math.random()*weight )-weight/2, (Math.random()*weight )-weight/2 ),
            new Vector( (Math.random()*weight )-weight/2, (Math.random()*weight )-weight/2 )
        ];
    }
}