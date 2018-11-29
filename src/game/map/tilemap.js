// Saves memory by storing redundant data in the same index
class TileMap extends BoPlane{
	constructor( rows, cols, defaultTile ){
		super( rows, cols, "payload" );
		
		this.forterator.default = this.createNode( 0, 0, defaultTile );
	}
}