class EntitySpritePerson extends EntitySprite{
	constructor( entity ){
		super( entity );
		this.source = Townsend.spritesheet.people1;
		this.shadowSpriteSize = new Vector( 8, 16 );
		this.shadowOffset = new Vector( -3, 2 );
		this.shadowKey = this.source.getSpriteAt( 0,8 );
		//this.spriteKey = new Vector();
		this.spriteSize = new Vector( 4, 16 );
    }
    
    get getDrawRegion(){
        return new PlanarRangeVector(
            ...this.wPixelCoordVect.add(this.entity.attributes.pixelLocation).add(this.shadowOffset.scale( Townsend.VCTSH.coefficient )).values,
            ...this.spriteSize.add(this.shadowSpriteSize.add(this.shadowOffset)).subtract(new Vector(0,16)).scale( Townsend.VCTSH.coefficient ).values );
    }

	t3_draw_shadow( pCoordVect ){
		this.source.drawPartialSprite(
			Townsend.CVSCTX.entities,
			this.shadowKey,
			...this.shadowSpriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ).add(this.shadowOffset.scale(Townsend.VCTSH.coefficient)),
			...this.shadowSpriteSize.scale( Townsend.VCTSH.coefficient ).values
		);
	}

	t3_draw( pCoordVect ){
		var actionKey = `t3_draw_${this.entity.actionName}`;
		if( !this[actionKey] ){ actionKey = `t3_draw_idle`; }
		this[actionKey]( pCoordVect );
	}

	t3_draw_idle( pCoordVect ){
		// Location of sprite as a product of ~~time~~ ticks
		var spriteKey = Math.floor( this.entity.tick/4 ) % 2;
		var direction = this.entity.tilePositionDiff.x >= 0 ? 0 : 8;
		this.t3_draw_shadow( pCoordVect );
		this.source.drawPartialSprite(
			Townsend.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey + direction ),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect,
			...this.spriteSize.scale( Townsend.VCTSH.coefficient ).values
		);
	}

	t3_draw_walk( pCoordVect ){
		var spriteKey = Math.floor( this.entity.tick/4 ) % 4;
		var direction = this.entity.tilePositionDiff.x > 0 ? 0 : 8;
		this.t3_draw_shadow( pCoordVect );
		this.source.drawPartialSprite(
			Townsend.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey+4  + direction),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ),
			...this.spriteSize.scale( Townsend.VCTSH.coefficient ).values
		);
	}
}