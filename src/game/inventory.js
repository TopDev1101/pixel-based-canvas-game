class Inventory{
    constructor( capacity ){
        this.itemStacks = [];
        this.itemStackSet = new Set();
        this.capacity = capacity;
        this.currentCapacity = 0;
    }

    refreshItemStackSet(){
        this.itemStacks.map( ( itemStack )=>{
            this.itemStackSet.add( itemStack.item.identityString );
        },this);
    }

    includes( resourceIdentity ){
        return this.itemStackSet.has( resourceIdentity );
    }

    getNonfullItemStack( itemIdentity ){
        var out = null;
        if( this.itemStackSet.includes() )
        return out;
    }

    /**
     * 
     * @param {Number} index 
     * @returns the removed itemStack
     */
    removeItemStack( index ){
        var itemStack = this.itemStacks.splice(index, 1)[0];
        this.refreshItemStackSet();
        this.currentCapacity-=itemStack.stackSize;
        return itemStack;
    }

    /**
     * 
     * @param {ItemStack} itemStack
     * @returns overflowItemStack
     */
    addItemStack( itemStack ){
        itemStack.inventory = this;
        itemStack.index = this.itemStacks.push(itemStack);
        var overflow = itemStack.stackSize + this.currentCapacity - this.capacity;
        this.refreshItemStackSet();
        if( overflow > 0 ){
            return itemStack.split( overflow );
        }
    }
}