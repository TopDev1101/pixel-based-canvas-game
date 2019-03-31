/**
 * Has data that will be used in rendering the map
 * pixelOffset - the offset of the mapview from 0,0
 * frameCounter - the total amount of frames drawn
 * scale - the scale of the tiles
 * tileSize - the size of a tile
 * scaleCoefficient - this times tileSize gives the size of a tile to be rendered
 * tileScaleSize - basically whats up there ^ but cached
 */

/**
 * ViewComponent defines the area which the game will be displayed
 */
class ViewContext { // Will eventually be split into TileViewContext and ViewContext
	/**
	 * View Component
	 */
	constructor() {
		var self = this;

		self.propipe = new PropertyPipeline(self)
			.set("cache", { package: {} })
			.set("children", {})
			.set("frameCounter", 0)
			.save();
	}

	// Was working on VCCAssign -->

	/**
	 * Cache packets of refrences
	 * Also for contexts to have easy access to other contexts
	 * @param {String} cacheIdentifier
	 * @param {Object[]} properties
	 */
	createCachePackage(cacheIdentifier, properties) {
		this.cache.package[cacheIdentifier] = properties;
	}

	/**
	 * Get a cached package
	 * @param {String} cacheIdentifier
	 */
	getCachePackage(cacheIdentifier) {
		return this.cache.package[cacheIdentifier];
	}

	/**
	 * Assign a context, must have certain methods to identify as a VCCompatableContext
	 * 
	 * Adding contexts links them all together, with respect to the parent
	 * This allows easy access to readily needed states while maintaining structure
	 * @param {any} context
	 */
	assignContext(contextInstance) {
		// If the contextInstance is a VCCompatibleContext
		if (VCContextCompatableInterface.confirm(contextInstance.__proto__)) {
			contextInstance.VCCAssign(this);
		}
	}
}

// Create a snapshot of object attributes access differences
// Best use for primitives
class AttributeSnapshot{
	constructor( object, attributesArray_String ){
		var self = this;
		self.object = object;
		self.snapshots = {};
		self.createSnap();
	}

	// Returns weather the attributes has changed from the snapshot
	compare(){
		var diff = 0,
			self = this;
		attributesArray_String.map( ( attr )=>{
			diff+= self.snapshots[attr] == self.object[attr] ? 0 : 1;
		});
		return diff <= 0;
	}

	createSnap(){
		var self = this;
		attributesArray_String.map( ( attr )=>{
			self.snapshots[attr] = self.object[attr];
		});
	}
}



/**
 * Uses of drawData:
 * engine/control/mouse.js
 * game/render/camera.js
 * game/render/routines/mouseupdate.js
 * game/render/routines/tiledraw.js
 * 
 * Uses of renederManager
 * game/render/camera.js
 * game/render/routines/mouseupdate.js
 *  game/render/routines/tiledraw.js
 */