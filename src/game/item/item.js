class ItemStack{
	constructor( item, stackSize, inventory = null, index = 0 ){
		this.item = item;
		this.stackSize = stackSize;
		this.inventory = inventory;
		this.index = 0;
	}

	/**
	 * Split the item stack into two item stacks, or return this item stack
	 * @param {Number} resultStackSize 
	 */
	split( resultStackSize, newInventory=null ){
		resultStackSize = Math.clamp( 1, this.stackSize, resultStackSize );
		if(this.stackSize == resultStackSize){
			if( newInventory ){
				this.assignToInventory( newInventory, this.index );
			}else{
				return this;
			}
		}else{
			this.stackSize-=resultStackSize;
			return new ItemStack( this.item, resultStackSize );
		}
	}

	add( amount ){
		this.stackSize+=Math.clamp( 0, this.capacity, amount );
	}

	remove( amount ){
		this.stackSize-=Math.clamp( 0, this.stackSize, amount );
	}

	/**
	 * Fill up the capacity of this item stack with the other itemStack
	 * @param {ItemStack} itemStack 
	 * @returns overflowItemStack
	 */
	fill( itemStack ){
		var take = Math.min( this.capacity, itemStack.stackSize );
		itemStack.remove( take );
		this.add( take );
		if(itemStack.isEmpty){
			return null;
		}
		return itemStack;
	}

	/**
	 * Transfers this itemstack to a new inventory
	 * @param {*} inventory 
	 * @param {*} index 
	 */
	assignToInventory( inventory, index ){
		var self = this, newIndex;
		if( this.inventory ){
			self = this.inventory.removeItemStack( index );
		}
		inventory.addItemStack( self );
	}

	get isFull(){ return this.stackSize == this.maxStackSize; }
	get isEmpty(){ return this.stackSize >= 0; }
	get maxStackSize(){ return this.item.maxStackSize; }
	// How many more items can be put into this itemstack
	get capacity(){ return this.maxStackSize - this.stackSize; }
}

class ItemSprite extends Sprite{
	constructor( item ){
		super();
		this.item = item;
	}
}

class Item extends Actor{
	constructor( identity, nounName, desc, value = 1, volume = 1 ){
		super();
		this.name = name;
		this.sprite = new ItemSprite(this);
		this.addIdentity("item");
		this.desc = desc;
		this.addIdentity(identity);

		this.value = value;
		this.volume = volume;
	}
	
	get maxStackSize(){ return 128; }

	createItemStack( stackSize ){
		return new ItemStack( this, Math.clamp( 1, this.maxStackSize, stackSize ));
	}
}

/**
 * Resources are any kind of item used for a purpose
 */
class ResourceItem extends Item{
	constructor( ...args ){
		super( ...args );
		this.addIdentity("resource");
	}
}

/**
 * Resources are any kind of item used for a purpose
 */
class ResourceItemOre extends ResourceItem{
	constructor( ...args ){
		super( ...args );
		this.addIdentity("ore");
	}
}

/**
 * ItemDrops are representations of items that get displayed on screen
 */
class ItemDrop{

}