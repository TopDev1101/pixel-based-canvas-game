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

keybinds.createAction("showDevTools", ()=>{ CLIENT_openDebugMenu(); });
keybinds.bindAction( "showDevTools", "Backquote" );