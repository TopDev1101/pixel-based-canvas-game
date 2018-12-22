const EF = ()=>{};

class KeybinderAction{
    constructor( actionID, keybinderParent ){
        this.keybinder = keybinderParent;
        this.id = actionID;

        // Not yet implemented
        this.whenPressed = EF;
        this.whenHeld = EF;
        this.whenReleased = EF;
    }

    onPressed( callback ){
        this.keybinder.actionPressed[this.id] = { pressStart: new Date().getTime(), callback: callback };
    }

    onHeld( callback ){
        this.keybinder.actionHeld[this.id] = { pressStart: new Date().getTime(), callback: callback };
    }

    onReleased( callback ){
        this.keybinder.actionRelease[this.id] = { pressStart: new Date().getTime(), callback: callback };
    }
}

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
        this.actions = {};
        this.keybinds = {};

        this.logBindCodeToConsole = false;

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
        // THIS IS PURELY FOR DEBUGGING
        // TODO REMOVE ONCE KEYBIND GUI IS IMPLEMENTED
        if(this.logBindCodeToConsole){ console.log(bindCode); }
        if(!action||this.actionLock[action]){return;}
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

    createAction( actionID, pressed=EF, held=EF, release=EF ){
        this.actionLock[actionID] = false;
        this.actionPressed[actionID] = { pressStart: new Date().getTime(), callback: pressed };
        this.actionHeld[actionID] = { pressStart: new Date().getTime(), callback: held };
        this.actionRelease[actionID] = { pressStart: new Date().getTime(), callback: release };
        return new KeybinderAction( actionID, this );
    }

    bindAction( actionID, bindCode, callback ){
        this.keybinds[ bindCode ] = actionID;
    }
}

