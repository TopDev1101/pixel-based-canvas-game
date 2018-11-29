// This gets passed to every tile draw call
class TileDrawPacket{
	
	/**
		data = {
			drawData:drawData,
			to: new Vector(),
			parent: data,
			TS: data.TS,
			coords: new Vector()
		}
	*/

	constructor( routineData, range ){
		this.viewContext =  routineData.viewContext;
		this.parent =  routineData;
		this.routineData = routineData;
		this.TS =  routineData.TS;
		this.range = range;
		this.time = new Date().getTime();
		// Update dependent data
		this.to = null;		// Where the tile will be drawn to viewcontex-relative space
		this.coords = null;	// The coordinates of the tile in tile-space
	}
	
	/**
		Updates the existing packet instead of creating a new one
		@param {int} x X coordinate of the tile
		@param {int} y Y coordinate of the tile
	*/
	update( x, y ){
		this.coords = new Vector( x+this.range.x, y+this.range.y );
		// Update dependent data
		this.to = new Vector(
			this.mod_math( this.parent.viewContext.pixelOffset.x, this.parent.viewContext.tileScaleHelper.tileSize )
				+ x * this.parent.viewContext.tileScaleHelper.tileSize,
			this.mod_math( this.parent.viewContext.pixelOffset.y, this.parent.viewContext.tileScaleHelper.tileSize )
				+ y * this.parent.viewContext.tileScaleHelper.tileSize
		);
		
	}

	mod_math(...a){
		return Math.mod(...a);
	}

	mod_native(...a){
		return Math.abs( a[0] ) % a[1];
	}
}
