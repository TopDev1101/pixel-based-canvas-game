// TODO integrate

class CursorInteractionContext {
	/**
	 * Defines a context for cursor interactions, not limited to canvas
	 * @param {HTMLElement} element the element this context will be bound to
	 */
	constructor( _ViewContext, element ) {
		var self = this;


		// Setup this instance
		self.propipe = new PropertyPipeline(self)
			.set("parentElement", element)
			.set("parentViewComponent", _ViewContext)
			.set("event", {})
			.set("position", new Vector(0, 0))
			.set("sideLength", cfg.tile_size)
			.set("handlers", {})
			.save();

		self.events = {};

		// Totally overrides onmousemove, use CursorInteractionContext.addHandler( "onmousemove", ()=>{})
		// to add event

		// Add the basic handlers that change .position and .event
		self.addHandler("onmousemove", self.defaultHandler);
	}

	get element(){ return this.parentElement; }

	/**
	 * The default handler
	 * @private
	 * @param {MouseEvent} event the event
	 */
	defaultHandler(self, event) {
		// Change the positions, relative to the parent
		self.position.x = event.clientX;
		self.position.y = event.clientY;
	}

	/**
	 * Emit an event, call all handlers
	 * @param {String} eventname the name of the event you wish to emit, such as onmousemove
	 * @param {MouseEvent} event any event
	 */
	emit(eventname, event) {
		var self = this;
		self.handlers[eventname].map((handler) => { handler(self, event) });
	}

	createListener( eventName ){
		var self = this;
		self.element[eventName] = (event) => { self.emit(eventName, event); };
	}

	/**
	 * Add a handler for an event
	 * @param {String} eventName the name of the event, such as onmousemove
	 * @param {Function} handler the name of the handler
	 */
	addHandler(eventName, handler) {
		var self = this;
		// Hangs onto the event
		if(!self.handlers[eventName]){
			self.handlers[eventName]=[
				(n, event)=>{ self.events[eventName]=event; }
			];
			self.createListener( eventName );
		}

		// Adds handler to routine
		self.handlers[eventName].push(handler);
	}
}


