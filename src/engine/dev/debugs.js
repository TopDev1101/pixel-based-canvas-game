/**
 * Standard execution limit
 */
var stdExecLimit = 100;

/**
 * Global limted execution functions
 */
var ExecLims = {
    log:{
        /**
         * Logs a tile being created
         */
        tileCreate: new ExecutionLimiter( stdExecLimit, console.log ),
        batchTileCoord: new ExecutionLimiter( 200, console.log )
    }
};

/**
 * The debug window provides useful information for analysis and debugging
 */
class DebugWindow{
    /**
     * Creates a new DebugWindow
     * @param {Number} width Width of the debug window container HTMLDivElement
     */
    constructor( width ){

        this.element = document.createElement("div");
        this.width = width;
        DebugWindow.stylizeElement(this.element);
        this.watchers = {};
        this.configurators = {};
        this.collapsibles = {};

        if(!cfg.debug_enable){
            console.warn(`"Debug is not enabled!" cfg.debug_enabled`);
            return;
        }
        
        this.appendWindowToBody( document.body );
    }

    /**
     * Appends the window to a HTMLElement
     * @param {*} element 
     */
    appendWindowToBody( parentElement ){
        parentElement.appendChild( this.element );
    }

    /**
     * Adds debugWindow style to an element
     * @param {HTMLElement} element 
     */
    static stylizeElement( element ){
        element.style.zIndex = 1000;
        element.style.width = this.width;
        element.style.position = "absolute";
        element.style.top = "0px";
        element.style.right = "0px";
        element.style.color = "white";
        element.style.wordWrap="break-word";
        element.style.fontSize=cfg.debug_window_FontSize;
        element.style.padding=3;
        element.style.backgroundColor = new Color(10, 15, 25, 0.5).rgbaString;
    }
    
    addCollapsable( id, contents ){

    }

    // Creates a section with a form for changing values
    addConfigurator( desc, on_submit ){
        
    }
    
    addWatcher( value, identity, fmt=JSON.stringify ){
        if(!cfg[`debug_${identity}_enable`]){
            console.warn(`"Watcher for [ ${identity} ] not enabled in config!" cfg.debug_${identity}_enabled`);
            return;
        }

        var self = this,
            watcher = {
                element: document.createElement("div")
            },
            element = watcher.element;
            
        self.watchers.interval = setInterval( ()=>{
            element.innerHTML = identity+": "+fmt( value );
        }, `cfg.debug_${identity}_interval` || cfg.debug_defaultInterval );

        self.element.appendChild( element );
        self.watchers[ identity ] = watcher;
    }
}