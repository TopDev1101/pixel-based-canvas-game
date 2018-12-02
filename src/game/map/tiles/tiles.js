// Definitions

TSINTERFACE.tiles.generic = new Tile();
TSINTERFACE.tiles.empty = new TileEmpty();
TSINTERFACE.tiles.grass = new TileGrass();
TSINTERFACE.tiles.wall = new TileWall();
TSINTERFACE.tiles.stone = new TileStone();
TSINTERFACE.tiles.stoneMeta1 = new TileStone(1);
TSINTERFACE.tiles.genericBush = new TileBush();
TSINTERFACE.tiles.berryBush = new TileBerryBush();
TSINTERFACE.tiles.mineHole = new TileMineHole();
TSINTERFACE.tiles.stockpile = new TileStockpile();
TSINTERFACE.tiles.woodPath = new TileWoodPath();
TSINTERFACE.tiles.sand = new TileSand();
TSINTERFACE.tiles.water = new TileWater();
// Debugs
TSINTERFACE.tiles.debugFNSUD = new TileDebugFNSUD();









TSINTERFACE.tiles.default = TSINTERFACE.tiles.grass;
TSINTERFACE.Tile = TSINTERFACE.tiles;

Object.values(TSINTERFACE.tiles).map( (genericTile)=>{
    genericTile.addIdentity("generic");
});

// Categorizing

// Sort out the tiles that can be built
TSINTERFACE.buildableTiles = {};
Object.keys( TSINTERFACE.tiles ).filter( (key)=>{
    return TSINTERFACE.tiles[key].isBuildable;
}).map( ( key )=>{
    TSINTERFACE.buildableTiles[key] = TSINTERFACE.tiles[key];
} );

// Sort oout the tiles that are made for debugging
TSINTERFACE.debugTiles = {};
Object.keys( TSINTERFACE.tiles ).filter( (key)=>{
    return TSINTERFACE.tiles[key].isDebug;
}).map( ( key )=>{
    TSINTERFACE.debugTiles[key] = TSINTERFACE.tiles[key];
} );

/////////////////
// Depreciated //
/////////////////