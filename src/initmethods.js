const FS = require("fs");

/**
 * This section is for global access
 */
Townsend = {
	instance:{},
	analytics:{},
	locked:{}, // Stuff that i thought would work, but doesn't
	batch:{
		count:0,
		overflowOffset: new Vector(1,0)
	},
	tiles:{},
	sprites:{},
	neighbourOffsetVectors:{
		north: new Vector( 0, -1 ),
		east: new Vector( 1,0 ),
		south: new Vector( 0, 1 ),
		west: new Vector( -1, 0)
	},
	neighbourDiagonalOffsetVectors:{
		northWest: new Vector( -1, -1 ),
		northEast: new Vector( 1, -1),
		southEast: new Vector( 1, 1),
		southWest: new Vector( -1, 1)
	},
	placeholders:{
		empty2dVector: new Vector( 0,0 ),
		chunkExtendVector: new PlanarRangeVector( 0, 0, 1, 1 )
	},
	eventEmitter: new SimpleEventEmitter(100),
	GUI:{
		containers:{}
	},
	safety:{
		memUsed:()=>{
			var a = process.memoryUsage();
			return a.rss + a.heapUsed;
		},
		heapWatch:()=>{
			var a = process.memoryUsage();
			b = a.rss + a.heapUsed;
			if(b/1024/1024>cfg.memory_max){
				alert(`[Townsend.safety] "Memory cap reached! Terminating."\n [${Math.floor(b/1024/1024)}/${cfg.memory_max}] mb `);
				process.exit();
			}
			return b;
		}
	}
};

// Translate labled neighbours to iterable array
Townsend.neighbourOffsetVectorList = Object.values( Townsend.neighbourOffsetVectors );
Townsend.neighbourDiagonalOffsetVectorList = Object.values( Townsend.neighbourDiagonalOffsetVectors );
Townsend.neighbourMergedOffsetVectorList = Object.values( Townsend.neighbourOffsetVectors );
Townsend.neighbourMergedOffsetVectorList.push( ...Object.values( Townsend.neighbourDiagonalOffsetVectors ) );

/**
 * This section is for native window
 */
if( nw ){
	Townsend.Window = nw.Window.get();
	Townsend.Window.maximize();
}

/**
 * This section is for making sure all sprite atalases are loaded
 */
Townsend.tilesheetsReady = 0;
Townsend.allTilesheetsLoaded = false;
var tilesheetReadyCheck = function(){
	Townsend.tilesheetsReady++;
	Townsend.allTilesheetsLoaded = Object.keys(Townsend.spritesheet).length <= Townsend.tilesheetsReady;
	console.log(`${Townsend.tilesheetsReady}/${Object.keys(Townsend.spritesheet).length} loaded`)
	if( Townsend.allTilesheetsLoaded ){
		console.log("All spritesheets loaded and ready to go!");
	}
}


var initMethods = [];

function start(){
	console.log("starting");
	initMethods.map( function(f){
		f();
	});
}