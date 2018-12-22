class EntitySpritePerson extends EntitySprite{
	constructor( entity ){
		super( entity );
		this.source = TSINTERFACE.spritesheet.people1;
		this.shadowSpriteSize = new Vector( 8, 16 );
		this.shadowOffset = new Vector( -3, 2 );
		this.shadowKey = this.source.getSpriteAt( 0,8 );
		//this.spriteKey = new Vector();
		this.spriteSize = new Vector( 4, 16 );
		this.debugColor = "#000";
	}

	static get actionColorMap(){
		return {
			"walk":"#FFF",
			"idle":"#000",
			"pathfinding":"#0FF"
		};
	}
	
	get actionColor(){
		return EntitySpritePerson.actionColorMap[this.entity.actionName];
	}
    
    get getDrawRegion(){
		this.entity.boundRegion = new Rectangle(
			...this.wPixelCoordVect
				.add( this.entity.attributes.pixelLocation )
				.add( this.shadowOffset.scale( TSINTERFACE.VCTSH.coefficient ))
				.values,
			...this.spriteSize
				.add( this.shadowSpriteSize.add( this.shadowOffset ))
				.subtract( TSINTERFACE.placeholders.personShadowBoundModifier )
				.scale( TSINTERFACE.VCTSH.coefficient ).values );
        return this.entity.boundRegion;
    }

	t3_draw_shadow( pCoordVect ){
		this.source.drawPartialSprite(
			TSINTERFACE.CVSCTX.entities,
			this.shadowKey,
			...this.shadowSpriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ).add(this.shadowOffset.scale(TSINTERFACE.VCTSH.coefficient)),
			...this.shadowSpriteSize.scale( TSINTERFACE.VCTSH.coefficient ).values
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
			TSINTERFACE.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey + direction ),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect,
			...this.spriteSize.scale( TSINTERFACE.VCTSH.coefficient ).values
		);
	}

	t3_draw_walk( pCoordVect ){
		var spriteKey = Math.floor( this.entity.tick/4 ) % 4;
		var direction = this.entity.tilePositionDiff.x > 0 ? 0 : 8;
		this.t3_draw_shadow( pCoordVect );
		this.source.drawPartialSprite(
			TSINTERFACE.CVSCTX.entities,
			this.source.getTileAt(4+(this.entity.attributes.sex*4), spriteKey+4  + direction),
			//this.source.getTileAt( 0, 1 ),
			...this.spriteSize.values,
			pCoordVect.add( this.entity.attributes.pixelLocation ),
			...this.spriteSize.scale( TSINTERFACE.VCTSH.coefficient ).values
		);
	}
}