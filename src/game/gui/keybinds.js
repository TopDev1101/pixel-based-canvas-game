var keybinds = new Keybinder(document.body);

class EscapeButtonHandler{
    constructor(){
        this.stack = [];
    }

    addToStack( callback ){
        this.stack.push(callback);
    }

    resetStack(){
        this.stack = [];
    }

    call(){
        return (/*Callback*/this.stack.pop())();
    }
}

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

keybinds.createAction("showDevTools", ()=>{ CLIENT_openDebugMenu(); });
keybinds.bindAction( "showDevTools", "Backquote" );

keybinds.createAction( "toggleKeyLogging_FOR_DEBUG_DO_NOT_USE_OTHERWISE", ()=>{} );
keybinds.bindAction( "toggleKeyLogging_FOR_DEBUG_DO_NOT_USE_OTHERWISE", "KeyB" );