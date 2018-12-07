const JSBUILDER_ANALYTICS=JSON.parse( '{"merged":86,"created":8,"chars":193059,"lines":6686,"libraries":15,"libList":["utils/debug.js","utils/string.js","utils/object.js","utils/math.js","utils/algorithmassist.js","utils/interface.js","containers/routinecollection.js","containers/vector.js","containers/forterate.js","containers/boplane.js","containers/uboplane.js","containers/propipe.js","objects/CRContext2DProxy.js","objects/Color.js","utils/simpleee.js"],"calls":[[24,"utils/debug.js"],[80,"utils/string.js"],[33,"utils/object.js"],[77,"utils/math.js"],[147,"utils/algorithmassist.js"],[26,"utils/interface.js"],[64,"containers/routinecollection.js"],[221,"containers/vector.js"],[142,"containers/forterate.js"],[217,"containers/boplane.js"],[145,"containers/uboplane.js"],[35,"containers/propipe.js"],[170,"objects/CRContext2DProxy.js"],[43,"objects/Color.js"],[32,"utils/simpleee.js"],[41,"src/engine/containers/vectorvariations.js"],[96,"src/initmethods.js"],[43,"src/game/actor.js"],[10,"src/localization/words.js"],[8,"src/localization/localization.js"],[35,"src/localization/en_us.js"],[103,"src/config.js"],[99,"src/engine/dev/debugs.js"],[107,"src/engine/render/rendering.js"],[55,"src/engine/containers/spritesources.js"],[109,"src/engine/containers/tilesheet.js"],[47,"src/engine/containers/spritesheet.js"],[106,"src/engine/render/viewcontext.js"],[117,"src/engine/render/tilescalehelper.js"],[341,"src/engine/render/tileviewcontext.js"],[86,"src/sprites/chunkrender.js"],[95,"src/sprites/sprite.js"],[47,"src/engine/render/spritedefs.js"],[85,"src/sprites/entitysprite/entitysprite.js"],[64,"src/sprites/entitysprite/person.js"],[157,"src/sprites/tilesprite/tilesprite.js"],[22,"src/sprites/tilesprite/nonsolid.js"],[31,"src/sprites/tilesprite/bush.js"],[42,"src/sprites/tilesprite/grass.js"],[90,"src/sprites/tilesprite/neighbourdependent.js"],[23,"src/sprites/tilesprite/metaneighdep.js"],[53,"src/sprites/tilesprite/wall.js"],[11,"src/sprites/tilesprite/sand.js"],[8,"src/sprites/tilesprite/water.js"],[10,"src/sprites/tilesprite/stockpile.js"],[10,"src/game/map/tilemap.js"],[18,"src/game/map/worldgen.js"],[492,"src/game/map/world.js"],[116,"src/game/map/chunk.js"],[53,"src/game/inventory.js"],[79,"src/game/gui/cursorinteractioncontext.js"],[123,"src/game/gui/mouseupdate.js"],[102,"src/game/gui/mousehandlers.js"],[117,"src/game/item/item.js"],[14,"src/game/item/items.js"],[342,"src/game/entity/ai/pathfinding.js"],[141,"src/game/entity/entity.js"],[228,"src/game/entity/living.js"],[88,"src/game/entity/person.js"],[285,"src/game/map/tiles/tile.js"],[12,"src/game/map/tiles/types/forageable.js"],[10,"src/game/map/tiles/empty.js"],[15,"src/game/map/tiles/simple/wall.js"],[15,"src/game/map/tiles/simple/stone.js"],[13,"src/game/map/tiles/simple/sand.js"],[12,"src/game/map/tiles/simple/water.js"],[14,"src/game/map/tiles/wild/bush.js"],[8,"src/game/map/tiles/wild/berrybush.js"],[23,"src/game/map/tiles/types/storage.js"],[18,"src/game/map/tiles/objects/stockpile.js"],[10,"src/game/map/tiles/simple/grass.js"],[18,"src/game/map/tiles/types/resource.js"],[15,"src/game/map/tiles/objects/minehole.js"],[15,"src/game/map/tiles/simple/woodpath.js"],[26,"src/game/map/tiles/debug/debugFNSUD.js"],[56,"src/game/map/tiles/tiles.js"],[76,"src/script.js"],[57,"src/game/gui/menuitem.js"],[35,"src/game/gui/submenucontainer.js"],[38,"src/game/gui/submenu.js"],[27,"src/game/gui/controlmenu.js"],[82,"src/game/gui/tooltip.js"],[104,"src/game/gui/example.js"],[77,"src/game/keybinder.js"],[34,"src/game/keybinds.js"],[63,"src/game/gui/loadingscreen.js"]],"ver":"0.0.1","outputFiles":["0_libraries.js","1_preinit.js","2_config.js","3_visualEngine.js","4_sprites.js","5_game.js","7_main.js","6_gui.js"]}' );/* File source: ../src/Ambitious_Dwarf///src/interfacenw.js */
/**
 * Defines the main
 */

function CLIENT_openDebugMenu(){
    nw.Window.get().showDevTools();
}
function CLIENT_resizeWindow(){}
function CLIENT_getGameFiles( buildPath ){
    var fs = require("fs");
    return fs.readdirSync( buildPath );
}
function CLIENT_parseCensusFile( filePath ){
	return FS.readFileSync(filePath).toString().split("\n").map( (x)=>{ var n = x.split(" ")[0]; if(n){ return n.toLowerCase().capitalize(); } } ).filter( (x)=>{ return !!x; } );
}
function CLIENT_NewSimplexNoise( seed ){
    return new SIMPLEX_NOISE( seed );
}


/* File source: ../src/Ambitious_Dwarf///src/engine/loader.js */
/**
 * Loads files in the appropriate order
 */
class GameLoader{
    /**
     * 
     * @param {String} buildPath 
     * @param {Regex} fileFormat 
     */
    constructor( buildPath = "./build", fileFormat = /\d+_\w+.js/){
        this.buildPath = "./build";

        
        this.loadOrder = CLIENT_getGameFiles( buildPath ).filter( (dir)=>{
            // Pull out the files with the right name format
            var a = fileFormat.test( dir );
            return a;
        }, this).sort( (a,b)=>{
            // Sort them into the appropriate load order
            return parseInt( b.split("_")[0] ) - parseInt( a.split("_")[0] );
        });
        this.loadNext();
    }

    /**
     * Loads the next file in the queue
     * @private
     */
    loadNext(){
        var fileName = this.loadOrder.pop(), self = this;
        var scriptElement = document.createElement("script");
        console.log(`Loading module ${ fileName }`);
        scriptElement.src = `${ this.buildPath }/${ fileName }`;
        scriptElement.onload = function(){
            if( self.loadOrder.length !=0 ){
                self.loadNext();
            }
        }
        document.body.appendChild( scriptElement );
    }
}

const GL = new GameLoader();

