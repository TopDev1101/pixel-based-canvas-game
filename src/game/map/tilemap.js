// Saves memory by storing redundant data in the same index
class TileMapBasic extends BasicPlane{
	constructor( size, defaultTile ){
		super( size, defaultTile );
		
		//this.forterator.default = this.createNode( 0, 0, defaultTile );
	}
}
// Saves memory by storing redundant data in the same index
class TileMapBop extends BoPlane{
	constructor( size, defaultTile ){
		super( size, size, "payload" );
		
		this.forterator.default = this.createNode( 0, 0, defaultTile );
	}
}

const TileMap = TileMapBasic;