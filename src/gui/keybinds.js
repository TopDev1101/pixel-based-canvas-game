var keybinds = new Keybinder(document.body);

class EscapeButtonHandler{
    constructor( defaultMethod ){
        this.stack = [defaultMethod];
        this.defaultMethod = defaultMethod;
    }

    addToStack( callback ){
        this.stack.push(callback);
        
    }

    resetStack(){
        this.stack = [];
    }

    call(){
        var callback = /*Callback*/this.stack.pop();
        if(this.stack.length == 0) this.stack.push(this.defaultMethod);
        return callback.apply(this);
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

keybinds.createAction( "toggleKeyLogging_FOR_DEBUG_DO_NOT_USE_OTHERWISE", ()=>{keybinds.logBindCodeToConsole = true;} );
keybinds.bindAction( "toggleKeyLogging_FOR_DEBUG_DO_NOT_USE_OTHERWISE", "ctrlKey_shiftKey_KeyB" );


function closeEscapeMenu(){
    console.log("Escape menu closed");
}

function openEscapeMenu(){
    this.addToStack( closeEscapeMenu );
    console.log("Escape menu open");
}

var escaper = new EscapeButtonHandler(openEscapeMenu);


keybinds.createAction( "escape", ()=>{ escaper.call() } );
keybinds.bindAction("escape", "Escape");