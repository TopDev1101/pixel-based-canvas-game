var IDENTITIES = [];
var ITRIDCTR = 0;
var NUMBER_OF_UUIDS = 0;
var ACTORS = [];

class Actor{
    constructor( baseIdentity ){
        this.identities = [];
        if(baseIdentity) this.addIdentity(baseIdentity);
        this.uuid = this.gITRID(); // Defined in ^ utils/string.js
        NUMBER_OF_UUIDS++;
        ACTORS.push(this);
    }

    static getAllWithIdentity( identity ){
        return ACTORS.filter( (x)=>{return x.hasIdentity(identity);} );
    }

    static getAllWithCondition( callback ){
        return ACTORS.filter( callback );
    }

    static getAllMatches( regex ){
        return ACTORS.filter( (x)=>{return x.identityString.match(regex);} );
    }

    gITRID(){
        var id = ITRIDCTR;
        ITRIDCTR++;
        return id;
    }

    /**
	 * Add a unique identity to the tile, ie. it's name
	 * @param {String} identity 
	 */
	addIdentity( identity ){
        if(!IDENTITIES.includes(identity)){
            IDENTITIES.push(identity);
        }
		this.identities.push( IDENTITIES.indexOf( identity ) );
    }

    hasIdentity( identity ){
        return this.identities.indexOf( IDENTITIES.indexOf(identity ) ) != -1;
    }
    
    get identityString(){
        return this.identities.map( (index)=>{ return IDENTITIES[index]; } ).join("-");
    }
}

