/* File source: ../src/Ambitious_Dwarf///src/game/gui/menuitem.js */
class GUIMenuItem{
    constructor( iconElement, tooltipLabel, tooltipDesc ){
        this.eventEmitter = new SimpleEventEmitter();

        this.tooltipLabel = tooltipLabel;
        this.tooltipDesc = tooltipDesc;

        this.icon = iconElement;
        this.iconContainer = document.createElement("div");
        this.iconContainer.classList.add( "menu-item-img-container" );
        this.element = document.createElement("div");
        this.element.classList.add( "menu-item" );

        this.iconContainer.appendChild(this.icon);
        this.element.appendChild(this.iconContainer);
        var self = this;
        
        this.icon.addEventListener( "mouseenter", ()=>{ self.showTooltip.apply(self); } );
        this.icon.addEventListener( "mouseleave", ()=>{ self.hideTooltip.apply(self); } );
    }

    showTooltip(){
        if( TSINTERFACE.tooltip &&  this.tooltipLabel ){
            TSINTERFACE.tooltip.reset();
            TSINTERFACE.tooltip.updateLabel( this.tooltipLabel );
            if( this.tooltipDesc ){TSINTERFACE.tooltip.updateDesc( this.tooltipDesc );}
            
            TSINTERFACE.tooltip.show();
        }
    }

    hideTooltip(){
        TSINTERFACE.tooltip.hide();
    }

    link( menuContainer ){
        this.menuContainer = menuContainer;
        this.menuContainer.element.appendChild(this.element);

        var self = this;
        this.icon.addEventListener("click", ()=>{self.on_click.apply(self);});
    }

    on_click(){
        var nextSubmenu = this.menuContainer.submenu.nextSubmenu;
        if(nextSubmenu){
            nextSubmenu.collapse();
        }
        this.on_activate();
    }

    on_activate(){
        console.log("Unlinked action");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/submenucontainer.js */
class GUISubmenuItemContainer{
    constructor(){
        this.element = document.createElement("div");
        this.element.classList.add("submenu-item-container");
        this.menuItems = [];
        this.hide();
    }

    addMenuItem( menuItem ){
        this.menuItems.push( menuItem );
        menuItem.link( this );
    }

    link( submenu ){
        this.submenu = submenu;
        submenu.element.appendChild(this.element);
    }

    show(){
        this.element.classList.remove("submenu-item-container-inactive");
    }

    hide(){
        this.element.classList.add("submenu-item-container-inactive");
    }
}

class GUISubmenuItemContainerGrid extends GUISubmenuItemContainer{
    constructor(){
        super();
        this.element.classList.add("submenu-item-container-grid");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/submenu.js */
class GUISubmenu{
    constructor(){
        this.submenuContainers = {};
        this.element = document.createElement("div");
        this.element.classList.add( "submenu" );
    }

    link( controlMenu ){
        this.controlMenu = controlMenu;
        controlMenu.element.prepend( this.element );
    }

    setNextSubmenu( submenu ){
        this.nextSubmenu = submenu;
    }

    addContainer( identifier, subMenuContainer ){
        this.submenuContainers[identifier] = subMenuContainer;
        subMenuContainer.link(this);
    }

    show( identifier ){
        this.submenuContainers[ identifier ].show();
    }

    collapse(){
        Object.keys( this.submenuContainers ).map( ( identifier )=>{
            this.submenuContainers[ identifier ].hide();
        }, this );
        if( this.nextSubmenu ){ this.nextSubmenu.collapse(); }
    }

    on_blur(){
        this.collapse();
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/controlmenu.js */
class GUIControlMenu{
    constructor(){
        this.submenus = [];
        this.mainSubmenu = null;
        this.element = document.createElement("div");
        this.element.classList.add("control-menu");
    }

    addSubmenu( submenu ){
        if(!this.mainSubmenu) this.mainSubmenu = submenu;
        this.submenus.push(submenu);
        if(this.submenus.length > 1){
            var lastSubmenu = this.submenus[this.submenus.length-2];
            lastSubmenu.setNextSubmenu( submenu );
        }
        submenu.link(this);
    }

    collapse(){
        this.submenus.map( (submenu)=>{
            submenu.collapse();
        });
        this.mainSubmenu.show("default");
    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/tooltip.js */
class GUIToolTip{
    constructor(){
        this.defaultOffset = new Vector( 12, -8 );
        this.offset = this.defaultOffset.copy();
        this.element = document.createElement("div");
        this.element.classList.add("tooltip");
        this.element.classList.add("tooltip-inactive");
        this.labelElement = document.createElement("div");
        this.element.classList.add("label");
        this.descElement = document.createElement("div");
        this.element.classList.add("desc");

        this.element.appendChild( this.labelElement );
        this.element.appendChild( this.descElement );

        document.body.appendChild(this.element);
    }

    get computedStyle(){
        return window.getComputedStyle( this.element );
    }

    updatePosition(x,y){
        this.element.style.top = `${y+this.offset.y}px`;
        this.element.style.left = `${x+this.offset.x}px`;
    }

    reset(){
        this.updateLabel("");
        this.updateDesc("");
    }

    updateLabel( label ){
        this.labelElement.innerText = label;
    }

    updateDesc( desc ){
        this.descElement.innerText = desc;
    }

    get width(){
        return parseFloat( this.computedStyle.width );
    }

    get height(){
        return parseFloat( this.computedStyle.height );
    }

    get clientX(){
        return parseFloat( this.computedStyle.left );
    }

    get clientY(){
        return parseFloat( this.computedStyle.top );
    }

    get isWidthOutOfBounds(){
        return this.width + this.clientX > window.innerWidth - 100;
    }

    get isHeightOutOfBounds(){
        return this.height + this.clientY > window.innerHeight - 100;
    }

    show(){
        this.element.classList.remove("tooltip-inactive");
        this.shown = true;
        if(this.isWidthOutOfBounds){ this.offset.x = -this.defaultOffset.x - this.width; } else { this.offset.x = this.defaultOffset.x; }
        if(this.isHeightOutOfBounds){ this.offset.y = -this.defaultOffset.y - this.height; } else { this.offset.y = this.defaultOffset.y; }
    }

    hide(){
        this.element.classList.add("tooltip-inactive");
        this.shown = false;
    }

    showWithDesc(){

    }
}

/* File source: ../src/Ambitious_Dwarf///src/game/gui/example.js */
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



TSINTERFACE.GUI.containers.smbcTileSelectGrid = new GUISubmenuItemContainerGrid();
TSINTERFACE.GUI.containers.smbcDebugTileSelectGrid = new GUISubmenuItemContainerGrid();

Object.values( TSINTERFACE.buildableTiles ).map( (tile)=>{
    var placeFunction = null;
    if(tile.isSpecial){
        placeFunction = ( x, y )=> { TSINTERFACE.World.placeTile( new tile.constructor(), x, y ); };
    }else{
        placeFunction = ( x, y )=> { TSINTERFACE.World.placeTile( tile, x, y ); };
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
    button.on_activate = ()=>{ TSINTERFACE.VCCUR.tilePlaceFunction = placeFunction; };

    if( tile.isDebug ){
        TSINTERFACE.GUI.containers.smbcDebugTileSelectGrid.addMenuItem( button );
        return;
    }
    TSINTERFACE.GUI.containers.smbcTileSelectGrid.addMenuItem( button );
});

/*
var smbcTileSelectGrid = new GUISubmenuItemContainerGrid();

var buttonBuildStockpile = new GUIMenuItem( createSource.img("src/assets/all.png") );
buttonBuildStockpile.on_activate = ()=>{ TSINTERFACE.VCCUR.tilePlaceFunction = ( x, y )=> { TSINTERFACE.World.placeTile( new TileStockpile(), x, y ); };  };
var buttonBuildWall = new GUIMenuItem( createSource.img("src/assets/gui-icon-walls.png") );
buttonBuildWall.on_activate = ()=>{ TSINTERFACE.VCCUR.tilePlaceFunction = ( x, y )=> { TSINTERFACE.World.placeTile( TSINTERFACE.Tile.wall, x, y ); };  };
var buttonBuildDeconstruct2 = new GUIMenuItem( createSource.img("src/assets/hammer.png") );
buttonBuildDeconstruct2.on_activate = ()=>{ TSINTERFACE.VCCUR.tilePlaceFunction = ( x, y )=> { TSINTERFACE.World.placeTile( TSINTERFACE.Tile.grass, x, y ); };  };

smbcTileSelectGrid.addMenuItem( buttonBuildWall );
smbcTileSelectGrid.addMenuItem( buttonBuildStockpile );
smbcTileSelectGrid.addMenuItem( buttonBuildDeconstruct2 );
*/

buttonBuildAll.on_activate = ()=>{
    TSINTERFACE.GUI.containers.smbcTileSelectGrid.show();
};

buttonBuildDebug.on_activate = ()=>{
    TSINTERFACE.GUI.containers.smbcDebugTileSelectGrid.show();
};



// Create a new submenus
var submenuMain = new GUISubmenu();
submenuMain.addContainer( "default", smbcMainControls );
var submenu2 = new GUISubmenu();
submenu2.addContainer( "building-controls", smbcBuildingControls );
var submenu3 = new GUISubmenu();
submenu3.addContainer( "tile-select-grid", TSINTERFACE.GUI.containers.smbcTileSelectGrid );
submenu3.addContainer( "debug-tile-select-grid", TSINTERFACE.GUI.containers.smbcDebugTileSelectGrid );

var menu = new GUIControlMenu();
menu.addSubmenu( submenuMain );
menu.addSubmenu( submenu2 );
menu.addSubmenu( submenu3 );


smbcMainControls.show();
document.body.appendChild(menu.element);

TSINTERFACE.tooltip = new GUIToolTip();

/* File source: ../src/Ambitious_Dwarf///src/game/keybinder.js */
class Keybinder{
    /**
     * 
     * @param {HTMLElement} htmlFocusElement this element will register the keys when it's bound
     */
    constructor( htmlFocusElement ){
        this.actionLock = {};
        this.actionLoop = {};
        this.actionPressed = {};
        this.actionHeld = {};
        this.actionRelease = {}
        this.actionHeldDelay = 100; //ms
        this.keybinds = {};

        this.element = htmlFocusElement;
        var self = this;
        this.element.addEventListener( "keydown", ( event )=>{ self.handlerKeyDown.apply(self, [event]); } );
        this.element.addEventListener( "keyup", ( event )=>{ self.handlerKeyUp.apply(self, [event]); } );

        this.doActionLoop();
    }

    getKey( event ){
        return event.code;
    }

    getModifiers( event ){
        return ["altKey","ctrlKey","shiftKey"].filter((key)=>{
            return event[key];
        }).join("_");
    }

    getBindCode( event ){
        return [this.getModifiers(event), this.getKey(event)].filter((x)=>{return x;}).join("_");
    }

    handlerKeyDown( event ){
        var bindCode = this.getBindCode(event),
            action = this.keybinds[bindCode];
        if(!action){return;}
        this.actionPressed[action].callback();
        this.actionLoop[action] = action;
        this.actionLock[action] = true;
    }

    doActionLoop(){
        var self = this;
        Object.values(this.actionLoop).map( (action)=>{
            self.actionHeld[action].callback();
        })
        setTimeout( ()=>{ self.doActionLoop.apply(self); } );
    }

    handlerKeyUp( event ){
        var bindCode = this.getBindCode(event),
            action = this.keybinds[bindCode];
        if(!action){return;}
        this.actionRelease[action].callback();
        delete this.actionLoop[action];
        this.actionLock[action] = false;
    }

    createAction( actionID, pressed, held=()=>{}, release=()=>{} ){
        this.actionLock[actionID] = false;
        this.actionPressed[actionID] = { pressStart: new Date().getTime(), callback: pressed };
        this.actionHeld[actionID] = { pressStart: new Date().getTime(), callback: held };
        this.actionRelease[actionID] = { pressStart: new Date().getTime(), callback: release };
    }

    bindAction( actionID, bindCode, callback ){
        this.keybinds[ bindCode ] = actionID;
    }
}



/* File source: ../src/Ambitious_Dwarf///src/game/keybinds.js */
var keybinds = new Keybinder(document.body);
// Positive x
keybinds.createAction( "shiftPixelOffset_px",()=>{},
    ()=>{
        TSINTERFACE.viewContext.pixelOffset.x-=cfg.map_move_speed;
    }
);
keybinds.bindAction( "shiftPixelOffset_px", "KeyD" );
// Negative X
keybinds.createAction( "shiftPixelOffset_nx",()=>{},
    ()=>{
        TSINTERFACE.viewContext.pixelOffset.x+=cfg.map_move_speed;
    }
);
keybinds.bindAction( "shiftPixelOffset_nx", "KeyA" );
// Positive y
keybinds.createAction( "shiftPixelOffset_py",()=>{},
    ()=>{
        TSINTERFACE.viewContext.pixelOffset.y+=cfg.map_move_speed;
    }
);
keybinds.bindAction( "shiftPixelOffset_py", "KeyW" );
// Negative y
keybinds.createAction( "shiftPixelOffset_ny",()=>{},
    ()=>{
        TSINTERFACE.viewContext.pixelOffset.y-=cfg.map_move_speed;
    }
);
keybinds.bindAction( "shiftPixelOffset_ny", "KeyS" );

keybinds.createAction("showDevTools", ()=>{ openDebugMenu(); });
keybinds.bindAction( "showDevTools", "Backquote" );

