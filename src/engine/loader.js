/**
 * Loads files in the appropriate order
 */
class GameLoader{
    /**
     * 
     * @param {String} buildPath 
     * @param {Regex} fileFormat 
     */
    constructor( buildPath = "./build", fileFormat = /\d+_\w+.js/){
        this.buildPath = "./build";

        var fs = require("fs");
        this.loadOrder = fs.readdirSync( buildPath ).filter( (dir)=>{
            // Pull out the files with the right name format
            var a = fileFormat.test( dir );
            return a;
        }, this).sort( (a,b)=>{
            // Sort them into the appropriate load order
            return parseInt( b.split("_")[0] ) - parseInt( a.split("_")[0] );
        });
        this.loadNext();
    }

    /**
     * Loads the next file in the queue
     * @private
     */
    loadNext(){
        var fileName = this.loadOrder.pop(), self = this;
        var scriptElement = document.createElement("script");
        console.log(`Loading module ${ fileName }`);
        scriptElement.src = `${ this.buildPath }/${ fileName }`;
        scriptElement.onload = function(){
            if( self.loadOrder.length !=0 ){
                self.loadNext();
            }
        }
        document.body.appendChild( scriptElement );
    }
}

const GL = new GameLoader();