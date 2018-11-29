
var map;

// For efficency, assume each nonregistered tile is a Tile

function initializeMap() {
	map = new TileMap(32, 32, new Tile());

	for (var x = 0; x < map.width; x++) {
		for (var y = 0; y < map.height; y++) {
			if (Math.random() <= 0.25) {
				if (Math.random() >= 0.5) {
					map.placeObject(x, y, new TreeTile());
				} else {
					map.placeObject(x, y, new WildPlantTile());
				}

			}

		}
	}
}