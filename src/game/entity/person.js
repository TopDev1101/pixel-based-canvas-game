

const NAMES_MALE = CLIENT_parseCensusFile( "./src/assets/lists/dist.male.first.txt" )
const NAMES_FEMALE = CLIENT_parseCensusFile("./src/assets/lists/dist.female.first.txt");
const NAMES_LAST = CLIENT_parseCensusFile("./src/assets/lists/dist.all.last.txt");


class PersonBuildJob extends EntityJob{
	constructor( destination, TileClass ){
		super( destination );
		this.TileClass = TileClass;
	}
	
	createProtocolInstance(){
		return [
			{task:"collectResources", params:TileClass }
		]
	}
}

class EntityPerson extends EntityLiving{
	constructor(  ){
		super();
		this.sprite = new EntitySpritePerson( this );
		this.profession = "person"; // The highest level job this person has
		this.addIdentity("person");
		this.inventory = new Inventory( 4 );
		this.skills = {
			
		};

		/**
		 * People have values which determine their behavour
		 * Values range from 0 to 10, 0 being not valued to 10 being
		 */
		this.values = {
			honor: 0,	// Will determine choices that are selfless 
			pride: 0,	// Will determine choices that require self-sacrifice
			respect: 0, // Will determine how much people like this person
			selfRespect: 0, // Will determine person's choice of self expression
			addicted: 0, // Applies to whether or not a person will get addicted to substances 
			promiscuous: 0,
			anxious: 0
		};

		this.diseases = [];

		this.giveNewName();
	}

	giveNewName(){
		var list = this.attributes.sex ? NAMES_FEMALE : NAMES_MALE ;
		this.attributes.name = `${list.random()} ${NAMES_LAST.random()}`;
	}

	/**
	 * 
	 * @param {String} resourceIdentifier Actor.identityString
	 */
	task_collectResources( resourceIdentifier ){

	}

	static get jobList(){
		return [
			"miner",
			"farmer"
		]
	}

	static get skillList(){
		return [
			"mining",

			"building",

			"farming",
			"planting",
			"harvesting",

			"foraging",

			"lumbering"
		]
	}
}