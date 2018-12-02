/**
 * Gets the location of the tile which the mouse is hovering on the element
 * ! Requires bound RegionRenderContext
 * @private
 * @param {MouseEvent} event mouse event
 */
function handle_elementHover(self, event) {
    TSINTERFACE.viewContext.requestRedraw();
    var tileSize = self.viewContext.tileScaleHelper.tileSize,
        position = self.position, // Mouse position, In pixels
        pixelOffset = self.parentViewComponent.pixelOffset, // View offset, in pixels
        entities = null,desc = "";

    // Some (hard to follow) math going on here
    self.tile = position
        .mutate() 							// Prepare vector for multiple operations
        .subtract( pixelOffset.add( self.viewContext.tileScaleHelper.cursorCorrection ) )			// Translate view-space pixel coordinates to tile-space pixel coordinates
        .scale( 1/tileSize ) 			// Transform tile-space pixel coordinates to tile-space coordinates, with sub-tile precision
        .forEach( Math.floor )				// Get rid of the decimal artifacts
        .forEach( (x)=>{ return x; } )  	// ¯\_(ツ)_/¯
        .unmutate();

    if(TSINTERFACE.World && TSINTERFACE.tooltip){
        entities = TSINTERFACE.World.entities.filter( (x)=>{return x.isHovered;} );
        
        var names = entities.map((e)=>{return e.attributes.name}).join("\n");
        desc+=names;
        if(desc.length >=1){
            TSINTERFACE.tooltip.reset();
            TSINTERFACE.tooltip.updateDesc( desc );
            TSINTERFACE.tooltip.show();
        }else{
            TSINTERFACE.tooltip.hide();
        }
    }
    document.title = JSON.stringify(self.tile);
}

/**
 * For global stuff
 */
function handle_globalHover(self, event){
    if(TSINTERFACE.tooltip){
        TSINTERFACE.tooltip.updatePosition(self.position.x,self.position.y);
    }
    self.lastMousePosition = new Vector( event.clientX, event.clientY );
}

function handle_placeBlock( self, event ){
    if(!TSINTERFACE.World) return;

    if( self.mousedown && self.events.onmousedown.button == 0 ){
        if( Object.className(TSINTERFACE.World.getTile( ...self.tile.values )) != "WallTile" ){
            self.tilePlaceFunction( ...self.tile.values );
            self.viewContext.frameNeedsUpdate = true;
        }
    }
}

function handle_moveMap( self, event ){
    if(!self.events.onmousedown) return;
    if( self.events.onmousedown.button==1 && self.mousedown ){
        var delta = self.lastMousePosition.subtract( new Vector( event.clientX, event.clientY ) );
        self.viewContext.pixelOffset.values[0]-=delta.x;
        self.viewContext.pixelOffset.values[1]-=delta.y;
        self.viewContext.frameNeedsUpdate = true;
    }
    self.lastMousePosition = new Vector( event.clientX, event.clientY );
}

// Events and stuff

function handle_elementMousedown( self, event ){
    if(!TSINTERFACE.World) return;
    TSINTERFACE.viewContext.requestRedraw();
    
    self.mousedown = true;
    var objAtLocation = TSINTERFACE.World.getTile( ...self.tile.values );
    if( event.button==0 ){
        self.tilePlaceFunction( ...self.tile.values );
    }
    self.lastClickPosition.assign( [event.clientX, event.clientY] );
    self.viewContext.frameNeedsUpdate = true;
}

function handle_elementMouseup( self, event ){
    
    TSINTERFACE.viewContext.requestRedraw();
    self.mousedown = false;
}

function handle_debugScrollIncriment( self, event ){
    var signX = Math.sign( event.deltaY ),
        output = "";
    // Debug stuff goes here
    TSINTERFACE.VCTSH.scale-=0.25*signX;
    
    document.title = self.viewContext.tileScaleHelper.scale;
    self.viewContext.frameNeedsUpdate = true;
}