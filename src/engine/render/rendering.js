var global = this;

class RenderingManager{
	/**
	 * RenderingManager holds canvases
	 * @param {String[]} canvasIdentifierList a string-list of canvas identifiers
	 */
	constructor(canvasIdentifierList) {
		var self = this;
		// If no canvas list is given, default to [ rendering, prerendering ]
		canvasIdentifierList = canvasIdentifierList ? canvasIdentifierList : [STR.ID.rendering, STR.ID.prerendering];

		new PropertyPipeline(self)
			.set("canvases", {})
			.set("contexts", {})
			.set("allocationIndecies",{})
			.set("drawRoutines", {})
			.set("canvasPipelines", {})
			.set("renderProxy", {});
		
		if( !CRContext2DProxy ){ throw STR.combine( [ STR.class.CRContext2DProxy, STR.error.NF ] ); }
		
		// Setup canvases
		canvasIdentifierList.map( ( canvasIdentifier, i, arr )=>{
			var canvas = document.createElement( STR.htmlTag.CANVAS ),
				context = canvas.getContext( STR.ID.contextType );
			
			self.canvases[canvasIdentifier] = canvas;
			self.contexts[canvasIdentifier] = context;
			self.canvasPipelines[canvasIdentifier] = new CRContext2DProxy(context);

			canvas.style.zIndex = (arr-i)*100;

			Townsend.Window.on("resize", ()=>{
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;		
				context.imageSmoothingEnabled = false;		
			})

			new PropertyPipeline(canvas)
					.set("className", canvasIdentifier)
					.set("id",canvasIdentifier)
					.set("width", window.innerWidth)
					.set("height", window.innerHeight)
					.set("imageSmoothingEnabled", false)
					.set("hide", function(){ this.style.visibility="hidden" })
					.close();

			self.allocationIndecies[ canvasIdentifier ] = 0;
			
			// Create a new routineCollection for this canvas
			self.drawRoutines[canvasIdentifier ] = new RoutineCollection();
			context.imageSmoothingEnabled = false;
		});

		// Assign-before-append
		document.body.appendChild( self.canvases.rendering );
		
		// CRContext2DProxy
		self.proxy = canvasIdentifierList[0];

		// The default canvas is the canvas assigned to the first identifier
		self.canvases.default = self.canvases[ canvasIdentifierList[ 0 ] ];

	}

	requestCanvasAllocation( canvasIdentifier, pixelWidth ){
		var availableIndex = this.allocationIndecies[ canvasIdentifier ];
		this.allocationIndecies[ canvasIdentifier ] +=pixelWidth;
		return availableIndex;
	}

	/**
	 * Assign a new drawroutine to a destination canvas
	 * @param {String} canvasIdentifier a canvas identifier
	 * @param {Routine} routine the drawroutine that will be assigned
	 */
	addRoutine( canvasIdentifier, routine ){
		var self = this;
		self.drawRoutines[ canvasIdentifier ].addRoutine( routine );
	}

	/**
	 * Call all drawroutines of a canvas
	 * @param {String} canvasIdentifier a canvas identifier
	 */
	render(canvasIdentifier ){
		var self = this;
		self.drawRoutines[canvasIdentifier ].call();
	}



	// Omit
	set proxy(canvasIdentifier ){
		var context = this.contexts[canvasIdentifier ];
		if( context ){
			this.renderProxy = new CRContext2DProxy(this.contexts[canvasIdentifier ] );
		}
	}
	
	get proxy(){
		return this.renderProxy;
	}
}