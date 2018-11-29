class ResourceTile extends StorageTile{
    constructor(){
        super();
        this.addIdentity("resource");
    }

    // Standard 20 ticks per resource
    get ticksPerResource(){ return 20; }

    /**
     * This will give the entity a resource from the tile
     * based on however it's implemented
     * @returns ItemStack
     */
    generateResource(){}
}