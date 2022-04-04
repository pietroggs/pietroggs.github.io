//namespace
window.chooseab = window.chooseab||{};

(function(wnd){
	
	//constructor
	var Engine = function(resource, stage){
		if(ydpjs == null && wnd.chooseab.ydpjs != undefined){
			ydpjs = wnd.chooseab.ydpjs;
		}
		
		this.lib = wnd.chooseab;
		this.initialize(resource, stage);
	}
	
	var p = Engine.prototype;
	
	//ydpjs lib namespace
	var ydpjs = null;
	
	p.stage = null;
	
	//Representative of fla file
	p.resource = null;
	
	//fla graphic library object
	p.lib = null;
	
	p.initialize = function(resource, stage){
		this.resource = resource;
		this.stage = stage;
		this.stage.enableMouseOver();
		Touch.enable(this.stage);
		
		this.pageChanged = false;
		
		$('.btna').mousedown(function(evt){ changeTab(2); });
		$('.btnb').mousedown(function(evt){ changeTab(3); });
		changeTab(1);
	}
	
	function changeTab(tabNum) {
		(tabNum==1) ? $('.tab1').css('display', 'block') : $('.tab1').css('display', 'none');
		(tabNum==2) ? $('.tab2').css('display', 'block') : $('.tab2').css('display', 'none');
		(tabNum==3) ? $('.tab3').css('display', 'block') : $('.tab3').css('display', 'none');
	}
	
	p.tick = function(){
		//Here place code which will execute in every frame		
		//this.stage.update();
		if (this.stage.isAnimationDisabled && !this.pageChanged) {
			this.pageChanged = true;
		} else if (!this.stage.isAnimationDisabled && this.pageChanged) {
			changeTab(1);
			if ( ($('.tab1').css('display')==='block') && ($('.tab2').css('display')==='none') && ($('.tab3').css('display')==='none') )
				this.pageChanged = false;
		}
	}
	
	wnd.chooseab.chooseabEngine = Engine;
	
}(window));