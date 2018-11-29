console.log("This is where the stuff will be");
var placeholder;
exports.log = function( obj ){
    console.log(obj);
    placeholder = obj;
    return obj;
}