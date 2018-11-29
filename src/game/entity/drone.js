class DroneSprite extends EntitySprite{
    constructor( entity ){
        super(entity);
        this.spriteSize = new Vector( 48, 48 );
        this.spriteShift = new Vector( -16, -16 ); // Because the sprite is actually massive
    }

    t3_draw( pCoordVect ){}
}

class DroneEntity extends Entity{
    constructor(){
        super( 10 );
        this.sprite = new DroneSprite( this );
        this.addIdentity("drone");
    }
}