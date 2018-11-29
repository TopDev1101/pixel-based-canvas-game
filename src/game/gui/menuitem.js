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
        if( Townsend.tooltip &&  this.tooltipLabel ){
            Townsend.tooltip.reset();
            Townsend.tooltip.updateLabel( this.tooltipLabel );
            if( this.tooltipDesc ){Townsend.tooltip.updateDesc( this.tooltipDesc );}
            
            Townsend.tooltip.show();
        }
    }

    hideTooltip(){
        Townsend.tooltip.hide();
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