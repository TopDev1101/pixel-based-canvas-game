class TileMineHole extends ResourceTile{
    constructor(){
        super();
        this.sprite = new TileSpriteNonSolid( this, TSINTERFACE.spritesheet.objects, new Vector(0,0) );
    }
    get name(){ return "Minehole"; }
    get isBuildable(){return true;}

    /**
     * @returns ItemStack
     */
    generateResource(){}
}