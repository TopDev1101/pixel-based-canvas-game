/**
 * Defines the main
 */

function CLIENT_openDebugMenu(){
    nw.Window.get().showDevTools();
}
function CLIENT_resizeWindow(){}
function CLIENT_getGameFiles( buildPath ){
    var fs = require("fs");
    return fs.readdirSync( buildPath );
}
function CLIENT_parseCensusFile( filePath ){
	return FS.readFileSync(filePath).toString().split("\n").map( (x)=>{ var n = x.split(" ")[0]; if(n){ return n.toLowerCase().capitalize(); } } ).filter( (x)=>{ return !!x; } );
}
function CLIENT_NewSimplexNoise( seed ){
    return new SIMPLEX_NOISE( seed );
}

window.addEventListener("error", ()=>{
    CLIENT_openDebugMenu();
})