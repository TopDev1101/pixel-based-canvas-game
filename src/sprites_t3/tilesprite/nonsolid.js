class TileSpriteNonSolid extends TileSprite{
	constructor( ...args ){
		super(...args);
	}

	/**
	 * @param {Chunk} chunk 
	 * @param {CoordinateVector} coordVect Chunk relative Tile coordinates
	 * @param {CoordinateVector} globalTileCoordVect Global tile coordinates, if that's important
	 */
	t3_draw( chunk, pCoordVect, globalTileCoordVect ){
		this.t3_drawGround(chunk, pCoordVect );
		this.source.drawTile(
			chunk.renderer.canvasCtx,
			this.sourceKey,
			pCoordVect,
			cfg.tile_size, cfg.tile_size
		);
	}
}