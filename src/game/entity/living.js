// This mood is a mood. 11/5/18
class Mood{
	constructor(level, desc){
		this.verb = "mood";
		this.desc = desc;
	}
}

class UpsetMood extends Mood{
	constructor(level, desc){
		super( level, desc );
		this.verb = "upset";
		this.desc = desc;
	}
}

const LivingEntityEvents = [
	"walkingDestinationReached", // When an entity reaches a destination
	"walkingInterruptedUnaccountedObstacle", // When an entity is walking, but is stopped by a new obstacle
	"walkingStepTaken",
	"walkingStart",
	"moveStart",

	"pathfindingStart",
	"pathfindingPathFound",
	"pathfindingPathNotFound",

	"actionBeginIdle",
	"actionBeginWalking",
	"actionDestinationReached",

	"jobBegin",
	"jobCanceled",
	"jobDone",
	"jobInterrupted"
];


class AttributeManagerEntityLiving{
    constructor( entity ){
        // Higher level stuff 11/5/18
        this.entity = entity;
        this.health = 100;
		this.sex = ([0,1]).randomElement();
		this.name = "living entity";
		this.level = 1;
		this.hungerLevel = 0; // 0 = not hungry, 10 = starving
		this.thirstLegvel = 0; // 0 not thirsty, 10 severely dehydrated
		this.performance = {
			strength: 1,	// Determines inventory size
			endurance: Math.floor( Math.random()*10 ),	// Determines
			agility: 5+Math.floor( Math.random()*10 ),		// Determines walking speed
			charisma: 1 	// Determines how much other entities like this entity
		};
    }

    // Hard cap on movementspeed is 5 ticks per tile
	get ticksPerTileTransition(){
		return Math.max( 5, 20-this.performance.agility );
	}
	
	get pixelLocation(){
		return this.entity.tilePositionDiff.scale(
			(this.entity.ticksSinceLastTileTransition) /
			this.ticksPerTileTransition
		).scale(Townsend.VCTSH.tileSize);
	}
    
    get tileTransitionInterval(){
		return cfg.tile_size / this.ticksPerTileTransition;
    }
}

class MovementManagerEntityLiving{
    constructor(){

    }
}

/**
 * Manages the actions of an entity
 */
class ActionManagerEntityLiving{
    constructor( entity ){
        this.entity = entity;
    }
}

class EntityLiving extends Entity{
	constructor( AttributeManager = AttributeManagerEntityLiving, ActionManager = ActionManagerEntityLiving, MovementManager = MovementManagerEntityLiving ){
        super();
        this.attributes = new AttributeManager( this );
        this.actions = new ActionManager( this );
        this.movements = new MovementManager( this );
        // Walking stuff
		this.pathfindingErrorHandler = new PathfindingErrorHandler();
		this.pathfindingAI = new PathfindingAI( EntityLiving.pathfindingDetectObsticle, this.pathfindingErrorHandler );
		this.pathfindingPromise = null;
		this.walkStartTick = 0;
		this.tilePositionDiff = new Vector(0,0);

		this.inventory = new Inventory(1);

		/**11/5/18
		 * Disambiguation
		 * Actions: The do's of an entity (per tick)
		 * Protocols: The how-to-do's of an entity
		 * Tasks: High level stuff ( build this, find that )
		 * 
		 * Tasks > Protocols > Actions > State changes
		 */
        
	}
	
	resetIdleTimer(){
		this.idleTimer = this.idleTimer = Math.max( Math.floor(Math.random()*100)-this.attributes.performance.endurance*8, 10 );
	}
    
    /**
	 * 
	 * @param {Tile} tile 
	 * @returns {Boolean} true -> is not obstacle
	 */
	static pathfindingDetectObsticle( tile ){
		return tile ? !tile.isObstacle : tile;
    }
    
    /**
	 * 
	 * @param {Number} x Global Tile Coordinate
	 * @param {Number} y Global Tile Coordinate
	 */
	task_move( x, y ){
		var self = this;
		self.eventEmitter.emit( "moveStart", self, x, y );
		this.pathfindingPromise = this.pathfindingAI.startPathfinding( this.globalTilePosition, new Vector( x, y ) );
		self.eventEmitter.emit( "pathfindingStart", self, self.pathfindingPromise );

		// Pathfinding promise handler
		this.pathfindingPromise.then( ( pathfindingNodeAtDestination )=>{
			self.eventEmitter.emit( "pathfindingPathFound", self, pathfindingNodeAtDestination );
			// Expand the path into an array
			self.pathfindingAI.expandPath( pathfindingNodeAtDestination );
			self.nextGlobalTilePosition = self.pathfindingAI.path.pop()
			this.tilePositionDiff = this.globalTilePosition.subtract( this.nextGlobalTilePosition ).scale(-1);
			// Start walking!
			self.eventEmitter.emit( "actionStartWalking", self );
			self.switchAction("walk");
		},
		( pathfindingError )=>{
			self.switchAction("idle");
			self.eventEmitter.emit( "pathfindingPathNotFound", self, pathfindingError );
			// Handle pathfinding errors here
		});
		//this.moveTo( x, y );
    }
    
    action_idle(){
		if( this.idleTimer!=0 ){
			this.idleTimer--;
			return;
		}
		this.resetIdleTimer();
		//this.eventEmitter.emit( "actionStartIdle", self );
		var idleWalkLocation = this.globalTilePosition.forEach( ( n )=>{
			return -cfg.entity_roam_dist/2 + Math.floor(Math.random()*cfg.entity_roam_dist+0.5) + n ;
		});
		this.task_move( ...idleWalkLocation.values );
	}

	action_repathfinding(){

	}

	

	get ticksSinceLastTileTransition(){
		return this.tick-this.walkStartTick;
	}

	action_walk(){
		var self = this;
		// Change globalTilePosition once f(t) == 0 [11/6/18]
		 // f(t) = t mod max(5, 20-a) [11/6/18]
		if(( this.ticksSinceLastTileTransition ) % ( this.attributes.ticksPerTileTransition ) == 0){

			// Grab the next position of the entity [11/6/18]
			this.walkStartTick = this.tick; // Reset for delta tick [11/6/18]
			

			

			this.moveTo( ...this.nextGlobalTilePosition.values );
			this.nextGlobalTilePosition = this.pathfindingAI.path.pop()
			this.tilePositionDiff = this.globalTilePosition.subtract( this.nextGlobalTilePosition ).scale(-1);
			// Find new path if current one is blocked by obstacle [11/6/18]
			if( !EntityLiving.pathfindingDetectObsticle( Townsend.World.getTile( ...this.nextGlobalTilePosition.values ) ) ){

				// Switch the action, handle the event
				this.tilePositionDiff = new Vector(0,0);
				this.switchAction("repathfinding");
				this.eventEmitter.emit( "walkingInterruptedUnaccountedObstacle", self, this.pathfindingAI.destination );
				return;
			}
			// Stop this action once the destination is reached [11/6/18]
			if(this.pathfindingAI.path.length==0){
				this.switchAction("idle");
				this.eventEmitter.emit( "actionDestinationReached", self );
				this.tilePositionDiff = new Vector(0,0);
				return;
			};
		}
    }
    
    on_walkingInterruptedUnaccountedObstacle( destination ){
		this.task_move( destination.values );
	}
}