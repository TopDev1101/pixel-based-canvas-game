class TileScaffolding extends StorageTile{
    /**
     * 
     * @param {Tile} buildsInto 
     */
    constructor( buildsInto ){
        super();
        this.sprite = new TileSprite( this, TSINTERFACE.spritesheet.objects, TSINTERFACE.spritesheet.objects.getSpriteAt(0,3) );
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
        TSINTERFACE.World.placeTile( this.tile , x, y )
    }
}