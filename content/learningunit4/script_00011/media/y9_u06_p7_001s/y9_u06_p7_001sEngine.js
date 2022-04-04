//namespace
window.y9u06p7001s = window.y9u06p7001s||{};

(function(wnd){
	
	//constructor
	var Engine = function(resource, stage){
		if(ydpjs == null && wnd.y9u06p7001s.ydpjs != undefined){
			ydpjs = wnd.y9u06p7001s.ydpjs;
		}
		
		this.lib = wnd.y9u06p7001s;
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
		
		this.div;
		this.enterPage = false;
		this.pageChanged = false;
	}
	
	p.initChooseAB = function() {
		var arr = $('div.simulation-html').children();
		for(var i=0;i<arr.length;i++) {
			if( $(arr[i]).has($(this.stage.canvas)).length ) {
				this.div = arr[i];
				break;
			}
		}
		
		var btna = $(this.div).parent().find('.btna');
		var btnb = $(this.div).parent().find('.btnb');
		var btnc = $(this.div).parent().find('.btnc');
		var tab1 = $(this.div).parent().find('.tab1')[0];
		var tab2 = $(this.div).parent().find('.tab2')[0];
		var tab3 = $(this.div).parent().find('.tab3')[0];
		var tabs = [tab1,tab2,tab3];
		
		$(btna).mousedown(function(evt){ changeTab(1,tabs); });
		$(btnb).mousedown(function(evt){ changeTab(2,tabs); });
		$(btnc).mousedown(function(evt){ changeTab(3,tabs); });
		changeTab(1,tabs);
	}
	
	function changeTab(tabNum,tabs) {
		(tabNum==1) ? $(tabs[0]).css('display', 'block') : $(tabs[0]).css('display', 'none');
		(tabNum==2) ? $(tabs[1]).css('display', 'block') : $(tabs[1]).css('display', 'none');
		(tabNum==3) ? $(tabs[2]).css('display', 'block') : $(tabs[2]).css('display', 'none');
	}
	
	p.tick = function() {
		if (this.stage.canvas && !this.enterPage) {
			this.enterPage = true;
			this.initChooseAB();
		}
	}
	
	wnd.y9u06p7001s.y9_u06_p7_001sEngine = Engine;
	
}(window));