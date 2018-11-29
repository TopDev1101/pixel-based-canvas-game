

class Entity extends Actor{
	/**
	 * 
	 * @param {Number} health 
	 */
	constructor(){
		super();
		var self = this;
		
		// Event stuff
		this.eventEmitter = new SimpleEventEmitter( cfg.eventlog_entity_size );

		// Positional stuff
		this.globalTilePosition = new Vector(0,0); // Global coordinates of the entity
		this.previousGlobalTilePosition = this.globalTilePosition.copy();	// Previous coordinates of the entity ( for animation )
		this.nextGlobalTilePosition = new Vector(0,0); // Next coordinate this entity will be in ( for animation )
		this.positionOffset = new Vector(4,-4); // Offset of entity within tile-region
		this.chunk = Townsend.World.getChunkFromTile( ...this.globalTilePosition.values ); // The chunk the entity is currently on
		
		// World interaction stuff
		this.action = null;
		this.actionName = "idle";
		this.tasks = [];
		this.jobs = [];
		this.tick=Math.floor(Math.random()*100);
		this.sprite = new EntitySprite( this );
		this.addIdentity("entity");
		this.idleTimer = Math.floor(Math.random()*100);

		// Creates a list of available actions for this entity 11/5/18
		this.actionsList = Object.getAllOwnPropertyNames(this).filter( ( key )=>{ return key.includes("action_");} );// Why is this useful? I don't know. 11/5/18
		this.tasksList = Object.getAllOwnPropertyNames(this).filter( ( key )=>{ return key.includes("task_");} );// Why is this useful? I don't know. 11/5/18
		this.switchAction("idle");

		// Top it all off
		this.setupEvents();
	}

	/**
	 * 
	 * @param {Number} x Global tile x coordinate
	 * @param {Number} y Global tile y coordinate
	 */
	updatePositionalStates( x, y ){
		this.globalTilePosition.x = x;
		this.globalTilePosition.y = y;
		this.chunk = Townsend.World.getChunkFromTile( ...this.globalTilePosition.values );
	}

	/**
	 * 
	 * @param {Number} x Tile X
	 * @param {Number} y Tile Y
	 */
	moveTo( x, y ){
		this.updatePositionalStates( x, y );
	}
	
	task_idle(){
		this.idleTimer = Math.floor(Math.random()*100);
	}

	resetIdleTimer(){
		this.idleTimer = Math.floor(Math.random()*100);
	}



	/**
	 * 11/5/18
	 * Why does moveTo and teleportTo do the same thing...
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	teleportTo( x, y ){
		this.updatePositionalStates( x, y );
	}

	update( tick ){
		this.isHovered = this.globalTilePosition.equals( Townsend.VCCUR.tile );
		this.actionProtocol();
	}

	actionProtocol(){
		this.tick++;
		this.action();
	}

	


	/**
	 * Actions are carried out every update tick ( 20 times per second );
	 */

	 /**
	  * 
	  * @param {String} actionID The id of the action
	  */
	switchAction( actionID ){
		var actionFunctionAccessKey = `action_${actionID}`;
		if(this[actionFunctionAccessKey]){
			this.action = this[actionFunctionAccessKey];
			this.actionName = actionID;
			this.eventEmitter.emit("actionSwitch", this, actionID);
		}else{
			this.action = this.action_idle;
			this.actionName = actionID;
		}
	}

	get chunkRelativePosition(){
		var self = this;
		return this.globalTilePosition.forEach( (x)=>{return Math.mod(x, self.chunk.size);} );
	}

	/**
	 * f(x) = tilePosition * tileSize + pixelScaleCoefficient * pixelOffset
	 * 			( Major position )	  +		( Minor position )
	 */
	get globalPixelPosition(){
		return this.globalTilePosition.scale( Townsend.VCTSH.tileSize ).add( this.positionOffset.scale( Townsend.VCTSH.coefficient ) );
	}

	
	////////////
	// EVENTS //
	////////////

	setupEvents(){
		var properties = Object.getAllOwnPropertyNames( this );
		var events = properties.filter( propName => (/^on_\w+$/m).test( propName ) );
		events.map( propName => this.eventEmitter.on( propName.split("on_")[1], this[propName] ), this );
	}
}
