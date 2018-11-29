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

        var fs = require("fs");
        this.loadOrder = fs.readdirSync( buildPath ).filter( (dir)=>{
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

const JSBUILDER_ANALYTICS=JSON.parse( '{"merged":86,"created":8,"chars":186653,"lines":6545,"libraries":15,"libList":["utils/debug.js","utils/string.js","utils/object.js","utils/math.js","utils/algorithmassist.js","utils/interface.js","containers/routinecollection.js","containers/vector.js","containers/forterate.js","containers/boplane.js","containers/uboplane.js","containers/propipe.js","objects/CRContext2DProxy.js","objects/Color.js","utils/simpleee.js"],"calls":[[24,"utils/debug.js"],[80,"utils/string.js"],[33,"utils/object.js"],[77,"utils/math.js"],[145,"utils/algorithmassist.js"],[26,"utils/interface.js"],[64,"containers/routinecollection.js"],[217,"containers/vector.js"],[142,"containers/forterate.js"],[217,"containers/boplane.js"],[145,"containers/uboplane.js"],[35,"containers/propipe.js"],[170,"objects/CRContext2DProxy.js"],[43,"objects/Color.js"],[32,"utils/simpleee.js"],[41,"src/engine/containers/vectorvariations.js"],[90,"src/initmethods.js"],[10,"src/localization/words.js"],[8,"src/localization/localization.js"],[35,"src/localization/en_us.js"],[92,"src/config.js"],[99,"src/engine/dev/debugs.js"],[107,"src/engine/render/rendering.js"],[10,"src/interfacenw.js"],[55,"src/engine/containers/spritesources.js"],[109,"src/engine/containers/tilesheet.js"],[47,"src/engine/containers/spritesheet.js"],[45,"src/game/render/DF/spritedefs.js"],[106,"src/game/render/viewcontext.js"],[117,"src/game/render/tilescalehelper.js"],[315,"src/game/render/tileviewcontext.js"],[82,"src/game/map/chunkrender.js"],[94,"src/game/render/sprite.js"],[85,"src/game/entity/sprite/entitysprite.js"],[64,"src/game/entity/sprite/person.js"],[157,"src/game/map/tilesprite/tilesprite.js"],[22,"src/game/map/tilesprite/nonsolid.js"],[31,"src/game/map/tilesprite/bush.js"],[90,"src/game/map/tilesprite/neighbourdependent.js"],[23,"src/game/map/tilesprite/metaneighdep.js"],[53,"src/game/map/tilesprite/wall.js"],[11,"src/game/map/tilesprite/sand.js"],[8,"src/game/map/tilesprite/water.js"],[10,"src/game/map/tilesprite/stockpile.js"],[43,"src/game/actor.js"],[10,"src/game/map/tilemap.js"],[18,"src/game/map/worldgen.js"],[479,"src/game/map/world.js"],[116,"src/game/map/chunk.js"],[53,"src/game/inventory.js"],[79,"src/game/render/routines/cursorinteractioncontext.js"],[123,"src/game/render/routines/mouseupdate.js"],[102,"src/game/render/routines/mousehandlers.js"],[117,"src/game/item/item.js"],[14,"src/game/item/items.js"],[342,"src/game/entity/ai/pathfinding.js"],[140,"src/game/entity/entity.js"],[220,"src/game/entity/living.js"],[90,"src/game/entity/person.js"],[285,"src/game/map/tiles/tile.js"],[12,"src/game/map/tiles/types/forageable.js"],[10,"src/game/map/tiles/empty.js"],[15,"src/game/map/tiles/simple/wall.js"],[15,"src/game/map/tiles/simple/stone.js"],[13,"src/game/map/tiles/simple/sand.js"],[12,"src/game/map/tiles/simple/water.js"],[14,"src/game/map/tiles/wild/bush.js"],[8,"src/game/map/tiles/wild/berrybush.js"],[23,"src/game/map/tiles/types/storage.js"],[18,"src/game/map/tiles/objects/stockpile.js"],[47,"src/game/map/tiles/simple/grass.js"],[18,"src/game/map/tiles/types/resource.js"],[15,"src/game/map/tiles/objects/minehole.js"],[15,"src/game/map/tiles/simple/woodpath.js"],[26,"src/game/map/tiles/debug/debugFNSUD.js"],[56,"src/game/map/tiles/tiles.js"],[69,"src/script.js"],[57,"src/game/gui/menuitem.js"],[35,"src/game/gui/submenucontainer.js"],[38,"src/game/gui/submenu.js"],[27,"src/game/gui/controlmenu.js"],[82,"src/game/gui/tooltip.js"],[104,"src/game/gui/example.js"],[77,"src/game/keybinder.js"],[34,"src/game/keybinds.js"],[45,"src/engine/loader.js"]],"ver":"0.0.1"}' );