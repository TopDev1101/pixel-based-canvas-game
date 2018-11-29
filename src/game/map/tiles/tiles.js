// Definitions

Townsend.tiles.generic = new Tile();
Townsend.tiles.empty = new TileEmpty();
Townsend.tiles.grass = new TileGrass();
Townsend.tiles.wall = new TileWall();
Townsend.tiles.stone = new TileStone();
Townsend.tiles.stoneMeta1 = new TileStone(1);
Townsend.tiles.genericBush = new TileBush();
Townsend.tiles.berryBush = new TileBerryBush();
Townsend.tiles.mineHole = new TileMineHole();
Townsend.tiles.stockpile = new TileStockpile();
Townsend.tiles.woodPath = new TileWoodPath();
Townsend.tiles.sand = new TileSand();
Townsend.tiles.water = new TileWater();
// Debugs
Townsend.tiles.debugFNSUD = new TileDebugFNSUD();









Townsend.tiles.default = Townsend.tiles.grass;
Townsend.Tile = Townsend.tiles;

Object.values(Townsend.tiles).map( (genericTile)=>{
    genericTile.addIdentity("generic");
});

// Categorizing

// Sort out the tiles that can be built
Townsend.buildableTiles = {};
Object.keys( Townsend.tiles ).filter( (key)=>{
    return Townsend.tiles[key].isBuildable;
}).map( ( key )=>{
    Townsend.buildableTiles[key] = Townsend.tiles[key];
} );

// Sort oout the tiles that are made for debugging
Townsend.debugTiles = {};
Object.keys( Townsend.tiles ).filter( (key)=>{
    return Townsend.tiles[key].isDebug;
}).map( ( key )=>{
    Townsend.debugTiles[key] = Townsend.tiles[key];
} );

/////////////////
// Depreciated //
/////////////////