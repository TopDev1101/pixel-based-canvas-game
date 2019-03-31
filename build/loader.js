const JSBUILDER_ANALYTICS=JSON.parse( '{"merged":91,"created":8,"chars":204271,"lines":7067,"libraries":16,"libList":["utils/debug.js","utils/string.js","utils/object.js","utils/math.js","utils/algorithmassist.js","utils/interface.js","containers/routinecollection.js","containers/vector.js","containers/forterate.js","containers/boplane.js","containers/uboplane.js","containers/basicplane.js","containers/propipe.js","objects/CRContext2DProxy.js","objects/Color.js","utils/simpleee.js"],"calls":[[24,"utils/debug.js"],[80,"utils/string.js"],[33,"utils/object.js"],[77,"utils/math.js"],[147,"utils/algorithmassist.js"],[26,"utils/interface.js"],[64,"containers/routinecollection.js"],[225,"containers/vector.js"],[146,"containers/forterate.js"],[217,"containers/boplane.js"],[145,"containers/uboplane.js"],[58,"containers/basicplane.js"],[35,"containers/propipe.js"],[170,"objects/CRContext2DProxy.js"],[43,"objects/Color.js"],[43,"utils/simpleee.js"],[41,"src/engine/containers/vectorvariations.js"],[97,"src/initmethods.js"],[55,"src/game/actor.js"],[10,"src/localization/words.js"],[8,"src/localization/localization.js"],[35,"src/localization/en_us.js"],[106,"src/config.js"],[99,"src/engine/dev/debugs.js"],[107,"src/engine/render_t3/rendering.js"],[55,"src/engine/containers/spritesources.js"],[109,"src/engine/containers/tilesheet.js"],[47,"src/engine/containers/spritesheet.js"],[106,"src/engine/render_t3/viewcontext.js"],[121,"src/engine/render_t3/tilescalehelper.js"],[211,"src/engine/render_t3/tileviewcontext.js"],[47,"src/engine/render_t3/routines/chunkdraw.js"],[38,"src/engine/render_t3/routines/entitydraw.js"],[26,"src/engine/render_t3/routines/framedraw.js"],[38,"src/engine/render_t3/routines/merge.js"],[86,"src/sprites_t3/chunkrender.js"],[95,"src/sprites_t3/sprite.js"],[47,"src/engine/render_t3/spritedefs.js"],[94,"src/sprites_t3/entitysprite/entitysprite.js"],[100,"src/sprites_t3/entitysprite/person.js"],[157,"src/sprites_t3/tilesprite/tilesprite.js"],[22,"src/sprites_t3/tilesprite/nonsolid.js"],[31,"src/sprites_t3/tilesprite/bush.js"],[42,"src/sprites_t3/tilesprite/grass.js"],[90,"src/sprites_t3/tilesprite/neighbourdependent.js"],[23,"src/sprites_t3/tilesprite/metaneighdep.js"],[53,"src/sprites_t3/tilesprite/wall.js"],[11,"src/sprites_t3/tilesprite/sand.js"],[8,"src/sprites_t3/tilesprite/water.js"],[10,"src/sprites_t3/tilesprite/stockpile.js"],[20,"src/game/map/tilemap.js"],[18,"src/game/map/worldgen.js"],[493,"src/game/map/world.js"],[127,"src/game/map/chunk.js"],[53,"src/game/inventory.js"],[82,"src/gui/cursorinteractioncontext.js"],[123,"src/gui/mouseupdate.js"],[171,"src/gui/mousehandlers.js"],[124,"src/game/item/item.js"],[14,"src/game/item/items.js"],[355,"src/game/entity/ai/pathfinding.js"],[144,"src/game/entity/entity.js"],[238,"src/game/entity/living.js"],[88,"src/game/entity/person.js"],[289,"src/game/map/tiles/tile.js"],[12,"src/game/map/tiles/types/forageable.js"],[10,"src/game/map/tiles/empty.js"],[15,"src/game/map/tiles/simple/wall.js"],[15,"src/game/map/tiles/simple/stone.js"],[13,"src/game/map/tiles/simple/sand.js"],[12,"src/game/map/tiles/simple/water.js"],[14,"src/game/map/tiles/wild/bush.js"],[8,"src/game/map/tiles/wild/berrybush.js"],[23,"src/game/map/tiles/types/storage.js"],[18,"src/game/map/tiles/objects/stockpile.js"],[10,"src/game/map/tiles/simple/grass.js"],[18,"src/game/map/tiles/types/resource.js"],[15,"src/game/map/tiles/objects/minehole.js"],[15,"src/game/map/tiles/simple/woodpath.js"],[26,"src/game/map/tiles/debug/debugFNSUD.js"],[56,"src/game/map/tiles/tiles.js"],[76,"src/script.js"],[57,"src/gui/menuitem.js"],[35,"src/gui/submenucontainer.js"],[38,"src/gui/submenu.js"],[27,"src/gui/controlmenu.js"],[83,"src/gui/tooltip.js"],[114,"src/gui/example.js"],[110,"src/gui/keybinder.js"],[76,"src/gui/keybinds.js"],[66,"src/gui/loadingscreen.js"]],"ver":"0.0.1","outputFiles":["0_libraries.js","1_preinit.js","2_config.js","3_t3_visualEngine.js","4_sprites.js","5_game.js","7_main.js","6_gui.js"],"classes":[["ExecutionLimiter",""],["Interface",""],["Routine",""],["RoutineCollection",""],["Vector",""],["Forterate",""],["BoPlane",""],["UboPlane",""],["BasicPlane",""],["PropertyPipeline",""],["CRContext2DProxy",""],["Color",""],["SimpleEventEmitter",""],["CoordinateVector","Vector"],["Rectangle","Vector"],["Actor",""],["Noun",""],["Localizer",""],["DebugWindow",""],["RenderingManager",""],["TileLocation",""],["TileManager",""],["Tilesheet",""],["Spritesheet","Tilesheet"],["ViewContext","//"],["AttributeSnapshot",""],["TileScaleHelper",""],["TileViewContext","ViewContext"],["ChunkRenderer","Actor"],["Sprite","Actor"],["PrerenderableSprite","Sprite"],["EntitySprite","PrerenderableSprite"],["EntityJob",""],["EntitySpritePerson","EntitySprite"],["TileSprite","PrerenderableSprite"],["TileSpriteNonSolid","TileSprite"],["TileSpriteBush","TileSprite"],["TileSpriteGrass","TileSprite"],["TileSpriteNeighbourDependent","TileSprite"],["TileSpriteMetaNeighbourDependent","TileSpriteNeighbourDependent"],["TileSpriteWall","TileSpriteNeighbourDependent"],["TileSpriteSand","TileSpriteNeighbourDependent"],["TileSpriteWater","TileSpriteNeighbourDependent"],["TileSpriteStockpile","TileSpriteNeighbourDependent"],["TileMapBasic","BasicPlane"],["TileMapBop","BoPlane"],["WorldGen",""],["SpecialTilePayload",""],["World",""],["ChunkActor","Actor"],["Chunk",""],["Inventory",""],["CursorInteractionContext",""],["TiledCursorInteractionContext","CursorInteractionContext"],["ItemStack",""],["ItemSprite","Sprite"],["Item","Actor"],["ResourceItem","Item"],["ResourceItemOre","ResourceItem"],["ItemDrop",""],["PathfindingMapNode",""],["PathfindingPathCache",""],["PathfindingErrorHandler",""],["PathfindingRuntime",""],["PathfindingAI",""],["Entity","Actor"],["Mood",""],["UpsetMood","Mood"],["AttributeManagerEntityLiving",""],["MovementManagerEntityLiving",""],["ActionManagerEntityLiving",""],["EntityLiving","Entity"],["PersonBuildJob","EntityJob"],["EntityPerson","EntityLiving"],["Tile","Actor"],["ForageableTile","Tile"],["TileEmpty","Tile"],["TileWall","Tile"],["TileStone","Tile"],["TileSand","Tile"],["TileWater","Tile"],["TileBush","ForageableTile"],["TileBerryBush","TileBush"],["StorageTile","Tile"],["TileStockpile","StorageTile"],["TileGrass","Tile"],["ResourceTile","StorageTile"],["TileMineHole","ResourceTile"],["TileWoodPath","Tile"],["TileDebugFNSUD","Tile"],["GUIMenuItem",""],["GUISubmenuItemContainer",""],["GUISubmenuItemContainerGrid","GUISubmenuItemContainer"],["GUISubmenu",""],["GUIControlMenu",""],["GUIToolTip",""],["KeybinderAction",""],["Keybinder",""],["EscapeButtonHandler",""],["LoadingScreen",""]],"classTree":{"":["ExecutionLimiter","Interface","Routine","RoutineCollection","Vector","Forterate","BoPlane","UboPlane","BasicPlane","PropertyPipeline","CRContext2DProxy","Color","SimpleEventEmitter","Actor","Noun","Localizer","DebugWindow","RenderingManager","TileLocation","TileManager","Tilesheet","AttributeSnapshot","TileScaleHelper","EntityJob","WorldGen","SpecialTilePayload","World","Chunk","Inventory","CursorInteractionContext","ItemStack","ItemDrop","PathfindingMapNode","PathfindingPathCache","PathfindingErrorHandler","PathfindingRuntime","PathfindingAI","Mood","AttributeManagerEntityLiving","MovementManagerEntityLiving","ActionManagerEntityLiving","GUIMenuItem","GUISubmenuItemContainer","GUISubmenu","GUIControlMenu","GUIToolTip","KeybinderAction","Keybinder","EscapeButtonHandler","LoadingScreen"],"Vector":["CoordinateVector","Rectangle"],"Tilesheet":["Spritesheet"],"//":["ViewContext"],"ViewContext":["TileViewContext"],"Actor":["ChunkRenderer","Sprite","ChunkActor","Item","Entity","Tile"],"Sprite":["PrerenderableSprite","ItemSprite"],"PrerenderableSprite":["EntitySprite","TileSprite"],"EntitySprite":["EntitySpritePerson"],"TileSprite":["TileSpriteNonSolid","TileSpriteBush","TileSpriteGrass","TileSpriteNeighbourDependent"],"TileSpriteNeighbourDependent":["TileSpriteMetaNeighbourDependent","TileSpriteWall","TileSpriteSand","TileSpriteWater","TileSpriteStockpile"],"BasicPlane":["TileMapBasic"],"BoPlane":["TileMapBop"],"CursorInteractionContext":["TiledCursorInteractionContext"],"Item":["ResourceItem"],"ResourceItem":["ResourceItemOre"],"Mood":["UpsetMood"],"Entity":["EntityLiving"],"EntityJob":["PersonBuildJob"],"EntityLiving":["EntityPerson"],"Tile":["ForageableTile","TileEmpty","TileWall","TileStone","TileSand","TileWater","StorageTile","TileGrass","TileWoodPath","TileDebugFNSUD"],"ForageableTile":["TileBush"],"TileBush":["TileBerryBush"],"StorageTile":["TileStockpile","ResourceTile"],"ResourceTile":["TileMineHole"],"GUISubmenuItemContainer":["GUISubmenuItemContainerGrid"]}}' );/* File source: ../src/Ambitious_Dwarf///src/interfaces/inwctx.js */
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

window.addEventListener("error", ()=>{
    CLIENT_openDebugMenu();
})

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

