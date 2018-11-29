class WildPlantTile extends Tile{
	constructor(){
		super();
		this.offset = new Vector(
			0,
			Math.random()*0.6+0.2
		);
		this.type = Math.floor( Math.random()*3 );

		this.addIdentity("wild-plant");
	}
}

// Trees are rendered halfway up the tile.
WildPlantTile.prototype.DEPRECIATED_draw = function( data ){
	var tilesheet = data.TS.DFDefault,				// Tilesheet
		parent = data.parent,				// Parent data
		viewContext = data.viewContext,
		tileSize = viewContext.tileScaleHelper.tileSize,
		location = this.getTileSpriteLocation( tilesheet );	// Tile location data
	
	this.drawGround( data );
	this.check_hovered( data );
	
	tilesheet.drawTile(
		parent.ctx,
		location,
		new Vector(
			data.to.x - tileSize * this.offset.x,
			data.to.y - tileSize * this.offset.y
		),
		tileSize,
		tileSize);
}

WildPlantTile.prototype.DEPRECIATED_getTileSpriteLocation = function( ts ){
	var c = ([
		[9,3],
		[15,12],
		[8,2]
	][ this.type ]);
	
	return ts.getTileAt( c[0], c[1] );
}