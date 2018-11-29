class TemplateSprite extends EntitySprite{
    constructor( entity ){
        super(entity);
        this.spriteSize = new Vector( 16, 16 );
    }

    t3_draw( pCoordVect ){}
}

class TemplateEntity extends Entity{
    constructor(){
        super( 10 );
        this.sprite = new TemplateSprite( this );
        this.addIdentity("template");
    }
}