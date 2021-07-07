(function (wnd) {

    var ImageAnimation = function (elem, url) {
        var th = this;
        this.mc = $('#img-' + elem);

        this.req = new XMLHttpRequest();
        this.req.open("GET", url);
        this.req.overrideMimeType("application/json");
        this.req.send(null);
        this.req.onreadystatechange = function() {
            if (th.req.readyState == 4 && th.req.status == 200) {
                th.json = JSON.parse(th.req.responseText);
                th.init();
            }
        };
    };

    var p = ImageAnimation.prototype;

	p.req = null;
    p.json = null;
    p.mc = null;
    p.mode = 'playOnce';
    p.frames = null;
    p.currentFrame = null;
    p.totalFrames = null;
	p.frameNumber;
	p.totalFrameNumber;

    p.init = function() {
        this.frames = [];
        this.currentFrame = 1;
        for(var i in this.json.frames) {
            this.frames.push(this.json.frames[i].frame);
        }
        this.totalFrames = this.frames.length;
        //this.gotoFrame(this.currentFrame);
    };

    p.gotoNextFrame = function() {
        this.currentFrame++;
		totalFrameNumber = this.totalFrames;
		frameNumber = this.currentFrame;
        if(this.currentFrame > this.totalFrames) {
            this.currentFrame = (this.mode === 'loop') ? 1 : this.totalFrames;
        }
        this.gotoFrame(this.currentFrame);
    };

    p.gotoFrame = function(frame) {
        var obj = this.frames[frame - 1];
        this.mc.attr('x', -obj.x);
        this.mc.attr('y', -obj.y);
    };
	
	p.setVisible = function(b) {
		b ? this.mc.show() : this.mc.hide();
	};

    wnd.ImageAnimation = ImageAnimation;

})(window);
