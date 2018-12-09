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