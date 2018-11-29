class TreeTile extends Tile{
	constructor(){
		super();
		this.isTree = true;
		this.offset = new Vector(
			0,
			0.5);
		this.spriteOffset = this.offset;
		this.type = Math.floor( Math.random()*5 );

		this.addIdentity("tree");
	}

}


// Trees are rendered halfway up the tile.
TreeTile.prototype.draw = function( data ){
	var tilesheet = data.TS.DFDefault,				// Tilesheet
		parent = data.parent,						// Parent data
		viewContext = data.viewContext,
		tileSize = viewContext.tileScaleHelper.tileSize,
		location = this.getTileSpriteLocation( tilesheet );	// Tile location data
		
	this.drawGround( data );
	this.check_hovered( data );
	
	tilesheet.drawTile(
		parent.ctx,
		location,
		new Vector(	// A happy little tree
			data.to.x - tileSize * this.offset.x,
			data.to.y - tileSize * this.offset.y
		),
		tileSize,
		tileSize*1.2 );
}

TreeTile.prototype.getTileSpriteLocation = function( ts ){
	var c = ([
		[0,6],
		[0,5],
		[1,7],
		[1,8],
		[15,15]
	][ this.type%5 ]);
	
	return ts.getTileAt( c[0], c[1] );
}