// Define the buttons
var buttonBuild = new GUIMenuItem( createSource.img("src/assets/build.png"), "Build Tiles" );
var buttonPeople = new GUIMenuItem( createSource.img("src/assets/person.png"), "People" );
var buttonStats = new GUIMenuItem( createSource.img("src/assets/stats.png"), "Statistics" );

// Define the submenucontainer
var smbcMainControls = new GUISubmenuItemContainer();
// Add buttons to submenucontainer
smbcMainControls.addMenuItem( buttonBuild );
smbcMainControls.addMenuItem( buttonPeople );
smbcMainControls.addMenuItem( buttonStats );

// Repeat
var buttonBuildAll = new GUIMenuItem( createSource.img("src/assets/all.png"), "All tiles" );
var buttonBuildDebug = new GUIMenuItem( createSource.img("src/assets/bug.png"), "Debug tiles" );
var buttonBuildDeconstruct = new GUIMenuItem( createSource.img("src/assets/hammer.png") );

var smbcBuildingControls = new GUISubmenuItemContainer();

smbcBuildingControls.addMenuItem( buttonBuildAll );
smbcBuildingControls.addMenuItem( buttonBuildDebug );
//smbcBuildingControls.addMenuItem( buttonBuildDeconstruct );

// Grid stuff
buttonBuild.on_activate = ()=>{
    smbcBuildingControls.show();
};



Townsend.GUI.containers.smbcTileSelectGrid = new GUISubmenuItemContainerGrid();
Townsend.GUI.containers.smbcDebugTileSelectGrid = new GUISubmenuItemContainerGrid();

Object.values( Townsend.buildableTiles ).map( (tile)=>{
    var placeFunction = null;
    if(tile.isSpecial){
        placeFunction = ( x, y )=> { Townsend.World.placeTile( new tile.constructor(), x, y ); };
    }else{
        placeFunction = ( x, y )=> { Townsend.World.placeTile( tile, x, y ); };
    }
    // Draw the tile onto a canvas
    var iconCanvas = document.createElement("canvas");
    iconCanvas.width = 28;
    iconCanvas.height = 28;
    var iconCtx = iconCanvas.getContext('2d');
    iconCtx.imageSmoothingEnabled = false;
    tile.sprite.draw_icon( iconCtx );
    // Use that canvas as an icon
    var button = new GUIMenuItem( iconCanvas, tile.name );
    button.on_activate = ()=>{ Townsend.VCCUR.tilePlaceFunction = placeFunction; };

    if( tile.isDebug ){
        Townsend.GUI.containers.smbcDebugTileSelectGrid.addMenuItem( button );
        return;
    }
    Townsend.GUI.containers.smbcTileSelectGrid.addMenuItem( button );
});

/*
var smbcTileSelectGrid = new GUISubmenuItemContainerGrid();

var buttonBuildStockpile = new GUIMenuItem( createSource.img("src/assets/all.png") );
buttonBuildStockpile.on_activate = ()=>{ Townsend.VCCUR.tilePlaceFunction = ( x, y )=> { Townsend.World.placeTile( new TileStockpile(), x, y ); };  };
var buttonBuildWall = new GUIMenuItem( createSource.img("src/assets/gui-icon-walls.png") );
buttonBuildWall.on_activate = ()=>{ Townsend.VCCUR.tilePlaceFunction = ( x, y )=> { Townsend.World.placeTile( Townsend.Tile.wall, x, y ); };  };
var buttonBuildDeconstruct2 = new GUIMenuItem( createSource.img("src/assets/hammer.png") );
buttonBuildDeconstruct2.on_activate = ()=>{ Townsend.VCCUR.tilePlaceFunction = ( x, y )=> { Townsend.World.placeTile( Townsend.Tile.grass, x, y ); };  };

smbcTileSelectGrid.addMenuItem( buttonBuildWall );
smbcTileSelectGrid.addMenuItem( buttonBuildStockpile );
smbcTileSelectGrid.addMenuItem( buttonBuildDeconstruct2 );
*/

buttonBuildAll.on_activate = ()=>{
    Townsend.GUI.containers.smbcTileSelectGrid.show();
};

buttonBuildDebug.on_activate = ()=>{
    Townsend.GUI.containers.smbcDebugTileSelectGrid.show();
};



// Create a new submenus
var submenuMain = new GUISubmenu();
submenuMain.addContainer( "default", smbcMainControls );
var submenu2 = new GUISubmenu();
submenu2.addContainer( "building-controls", smbcBuildingControls );
var submenu3 = new GUISubmenu();
submenu3.addContainer( "tile-select-grid", Townsend.GUI.containers.smbcTileSelectGrid );
submenu3.addContainer( "debug-tile-select-grid", Townsend.GUI.containers.smbcDebugTileSelectGrid );

var menu = new GUIControlMenu();
menu.addSubmenu( submenuMain );
menu.addSubmenu( submenu2 );
menu.addSubmenu( submenu3 );


smbcMainControls.show();
document.body.appendChild(menu.element);

Townsend.tooltip = new GUIToolTip();