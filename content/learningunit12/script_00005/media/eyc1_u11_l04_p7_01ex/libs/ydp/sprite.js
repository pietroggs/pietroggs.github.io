(function (wnd) {
	
	// Sprite version 1.0.0

    var Sprite = function (id) {
		this.mc = $('#'+id);
    };

    var p = Sprite.prototype;

	p.mc = null;
	p.transforms = null;
	p.transformFrame = null;
	
	p.setTransforms = function(arr) {
		this.transforms = arr;
	}
	
	p.reset = function() {
		var t = this.transforms['frame0'];
		if (t) {
			var a = t.split('|');
			this.mc.css({
				'-webkit-transition-duration': a[1],
				'transition-duration': a[1],
				'-webkit-transform': a[0],
				'transform': a[0]
			});
		}
		this.transformFrame = -1;
	};

    p.gotoAndStop = function(frame) {
		var t = this.transforms['frame'+frame];
		if (t && this.transformFrame !== frame) {
			this.transformFrame = frame;
			var a = t.split('|');
			this.mc.css({
				'-webkit-transition-duration': a[1],
				'transition-duration': a[1],
				'-webkit-transform': a[0],
				'transform': a[0]
			});
		}
    };

    wnd.Sprite = Sprite;

})(window);
