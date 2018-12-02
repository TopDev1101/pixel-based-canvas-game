var SSPlaceholders = new Spritesheet( createSource.img( "src/assets/placeholder-atlas.png" ), 16, tilesheetReadyCheck );
var SSDFDefault = new Spritesheet( createSource.img( "src/assets/DF/03.png" ), 16, tilesheetReadyCheck );
var SSGrounds = new Spritesheet( createSource.img( "src/assets/grounds.png" ), 16, tilesheetReadyCheck );
var SSPlants1 = new Spritesheet( createSource.img( "src/assets/bush1.png" ), 16, tilesheetReadyCheck );
var SSPeople1 = new Spritesheet( createSource.img( "src/assets/people1.png" ), 4, tilesheetReadyCheck );
var SSObjects = new Spritesheet( createSource.img( "src/assets/objects.png" ), 16, tilesheetReadyCheck );
var SSFloors = new Spritesheet( createSource.img( "src/assets/floors.png" ), 16, tilesheetReadyCheck );
var SSWalls = new Spritesheet( createSource.img( "src/assets/walls.png" ), 16, tilesheetReadyCheck );
var SSDrone = new Spritesheet( createSource.img( "src/assets/drone.png" ), 16, tilesheetReadyCheck );
var SSLMFAO = new Spritesheet( createSource.img( "src/assets/lmfao/lmfaolux.png" ), 16, tilesheetReadyCheck );

Townsend.spritesheet = {
	placeholders: SSPlaceholders,
	DFDefault: SSDFDefault,
	grounds: SSGrounds,
	plants1: SSPlants1,
	people1: SSPeople1,
	objects: SSObjects,
	floors: SSFloors,
	walls: SSWalls,
	drone: SSDrone,
	LMFAO: SSLMFAO
};

// SSPlaceholders
SSPlaceholders.addTile("sprite-missing-tile-sprite", new Vector(0,0));
SSPlaceholders.addTile("sprite-missing-entity-sprite", new Vector(0,1));
SSPlaceholders.addTile("sprite-missing-sprite", new Vector(0,2));
SSPlaceholders.addTile("sprite-blank", new Vector(0,3));

// SSGrounds
SSGrounds.addTile("sprite-grass0", new Vector(0,0));
SSGrounds.addTile("sprite-grass1", new Vector(0,1));
SSGrounds.addTile("sprite-grass2", new Vector(0,2));
SSGrounds.addTile("sprite-grass-shadow0", new Vector(0,3));
SSGrounds.addTile("sprite-grass-shadow1", new Vector(0,4));
SSGrounds.addTile("sprite-stone", new Vector(0,5));
SSGrounds.addTile("sprite-water", new Vector(0,6));
SSGrounds.addTile("sprite-sand", new Vector(0,7));

// SSFloors
SSFloors.addTile("atlas-stockpile", new Vector(0,0));
SSFloors.addTile("atlas-sand", new Vector(3,0));
SSFloors.addTile("atlas-wood-path", new Vector(6,0));
SSFloors.addTile("atlas-water", new Vector(9,0));