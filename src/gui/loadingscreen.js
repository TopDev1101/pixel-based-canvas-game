class LoadingScreen{
    constructor(){
        this.backdrop = document.createElement("div");
        this.backdrop.classList.add("loading-screen-backdrop");
        this.element = document.createElement("div");
        this.element.classList.add("loading-screen");
        this.backdrop.appendChild(this.element);
        document.body.appendChild(this.backdrop);
    }

    // Progress bar container identity parts lol.
    static get pbCIDPs(){
        return ["pc","t","pb"];
    }


    /**
     * Adds a progress bar
     * @param {String} id 
     * @param {String} title 
     * @returns (void) callback( n ) change percentage of the progress bar to n (0-100)
     */
    createProgressBar( id, title ){
        var html = `
            <div class="progress-container" id="${id}-pc">
                <div class="title id="${id}-t">${title}</div>
                <div class="progress-bar">
                    <div class="progress" id="${id}-pb">
                    </div>
                </div>
            </div>
        `;

        this.element.innerHTML+=html;
        var self = this;
        self.show();
        var elem = document.getElementById(`${id}-pb`),
            cb = (n)=>{
                elem.style.width = `${n}%`;
                elem.innerText = `${Math.floor(n)}%`
                if(n==100){
                    self.hide();
                }
            };

        return cb;
    }

    createComment( comment ){
        var html = `<div class="comment">${comment}</div>`;
        this.element.innerHTML+=html;
    }

    show(){
        this.backdrop.classList.add("loading-screen-active");
    }

    hide(){
        this.backdrop.classList.remove("loading-screen-active");
    }
}

Townsend.loadingScreen = new LoadingScreen();
Townsend.loadingScreen.show();