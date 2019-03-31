/**
 * Defines the main
 */
const modulePaths = {
    "simplex-noise":"./src/libs/simplex-noise.js"
};
function require(module){
    if(modulePaths[module]){
        var script = document.createElement("script");
        script.src=modulePaths[module];
        document.body.appendChild(script);
    }
}

function CLIENT_openDebugMenu(){ console.log("[CLIENT_openDebugMenu] feature not available in browser"); }
function CLIENT_resizeWindow(){ console.log("[CLIENT_resizeWindow] feature not available in browser"); }

function CLIENT_getGameFiles(){
    return JSBUILDER_ANALYTICS.outputFiles;
}
function CLIENT_parseCensusFile(  ){
    return ["Mike", "Joe", "Allen"];
}
function CLIENT_NewSimplexNoise(){
    return new SimplexNoise();
}