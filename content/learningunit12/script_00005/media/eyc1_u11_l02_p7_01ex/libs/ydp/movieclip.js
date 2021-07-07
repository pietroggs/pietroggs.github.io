(function (wnd) {
	
	// MovieClip version 1.0.1

    var MovieClip = function(div) {
		this.div = div;
		this.img = div.find('img');
		this.transforms = {};
    };

    var p = MovieClip.prototype;

    p.timeline = null;
    p.animClasses = null;
	p.transforms = null;
	p.currentLabel = null;
	p.transformFrame = null;
	p.anim = null;
	p.img = null;
	
	p.setTimeline = function(arr) {
		/*this.timeline = {};
		for (var i=0;i<arr.length;i++) {
			this.timeline['f'+arr[i][0]] = arr[i][1];
		}*/
		this.timeline = {};
		var cf = 0;
		var lf;
		for (var i=0;i<arr.length;i++) {
			var ff = arr[i][0];
			if (ff > cf) {
				for (var j=0;j<ff-cf;j++) {
					cf++;
					this.timeline['f'+cf] = lf;
				}
			}
			cf = ff;
			lf = arr[i][1]
			this.timeline['f'+cf] = lf;
		}
	};
	
	p.setTransforms = function(obj) {
		this.transforms = obj;
	}
	
	p.reset = function() {
		var cls = (this.timeline) ? this.timeline['f0'] : null;
		if (cls) {
			this.img.removeClass().addClass(cls);
			this.currentLabel = cls;
		}

		var t = this.transforms['frame0'];
		if (t) {
			var a = this.transforms['frame0'].split('|');
			this.div.css({
				'-webkit-transition-duration': a[1],
				'transition-duration': a[1],
				'-webkit-transform': a[0],
				'transform': a[0]
			});
		}
		this.transformFrame = -1;
	};

    p.gotoAndStop = function(frame) {
		var cls = (this.timeline) ? this.timeline['f'+frame] : null;
		if (cls && cls !== this.currentLabel) {
			this.img.removeClass();
			this.img.addClass(cls);
			this.currentLabel = cls;
		}
		
		var t = this.transforms['frame'+frame];
		if (t && this.transformFrame !== frame) {
			this.transformFrame = frame;
			var a = t.split('|');
			this.div.css({
				'-webkit-transition-duration': a[1],
				'transition-duration': a[1],
				'-webkit-transform': a[0],
				'transform': a[0]
			});
		}
    };

    wnd.MovieClip = MovieClip;

})(window);
