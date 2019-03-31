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