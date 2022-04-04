if (!window.chooseab) { window.chooseab = {}; }

var p; // shortcut to reference prototypes

// stage content:
(window.chooseab.chooseab = function() {
	this.initialize();

	// Layer 1
	this.shape = new Shape();
	this.shape.graphics.f("rgba(255,255,255,0.302)").p("AAFgEIgJAAIAAAJIAJAAIAAgJ").f();
	this.shape.setTransform(0.5,0.5);

	this.addChild(this.shape);
}).prototype = p = new Container();
p.nominalBounds = new Rectangle(0,0,1,1);