class GUIToolTip{
    constructor(){
        this.defaultOffset = new Vector( 12, -8 );
        this.offset = this.defaultOffset.copy();
        this.element = document.createElement("div");
        this.element.classList.add("tooltip");
        this.element.classList.add("tooltip-inactive");
        this.labelElement = document.createElement("div");
        this.element.classList.add("label");
        this.descElement = document.createElement("div");
        this.element.classList.add("desc");

        this.element.appendChild( this.labelElement );
        this.element.appendChild( this.descElement );

        document.body.appendChild(this.element);
    }

    get computedStyle(){
        return window.getComputedStyle( this.element );
    }

    updatePosition(x,y){
        this.element.style.top = `${y+this.offset.y}px`;
        this.element.style.left = `${x+this.offset.x}px`;
    }

    reset(){
        this.updateLabel("");
        this.updateDesc("");
    }

    updateLabel( label ){
        this.labelElement.innerText = label;
    }

    updateDesc( desc ){
        this.descElement.innerText = desc;
    }

    get width(){
        return parseFloat( this.computedStyle.width );
    }

    get height(){
        return parseFloat( this.computedStyle.height );
    }

    get clientX(){
        return parseFloat( this.computedStyle.left );
    }

    get clientY(){
        return parseFloat( this.computedStyle.top );
    }

    get isWidthOutOfBounds(){
        return this.width + this.clientX > window.innerWidth - 100;
    }

    get isHeightOutOfBounds(){
        return this.height + this.clientY > window.innerHeight - 100;
    }

    show(){
        this.element.classList.remove("tooltip-inactive");
        this.shown = true;
        if(this.isWidthOutOfBounds){ this.offset.x = -this.defaultOffset.x - this.width; } else { this.offset.x = this.defaultOffset.x; }
        if(this.isHeightOutOfBounds){ this.offset.y = -this.defaultOffset.y - this.height; } else { this.offset.y = this.defaultOffset.y; }
    }

    hide(){
        if(this.forceShow) return;
        this.element.classList.add("tooltip-inactive");
        this.shown = false;
    }

    showWithDesc(){

    }
}