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