class TileScaffolding extends StorageTile{
    /**
     * 
     * @param {Tile} buildsInto 
     */
    constructor( buildsInto ){
        super();
        this.sprite = new TileSprite( this, Townsend.spritesheet.objects, Townsend.spritesheet.objects.getSpriteAt(0,3) );
        this.isSpecial = true;
        this.buildsInto = buildsInto;
    }

    canBeReached(){
        
    }

    action_build(){

    }

    tile(){
        if( this.buildsInto.isSpecialTile ){
            return new this.buildsInto.constructor();
        }
        return this.buildsInto;
    }

    on_constructed( x, y ){
        Townsend.World.placeTile( this.tile , x, y )
    }
}