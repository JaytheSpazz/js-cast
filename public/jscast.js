  
(function(){
	var wami_initialized= false, recording= false;
	var evt_handler;
	var wami_div_id;
	
	var SClass= function(){
		//load additional js required for wami
	};
	
	SClass.prototype.configure= function(options, callback){
		wami_div_id= options.wami_container;
		evt_handler= callback;
	};
	
	SClass.prototype.create= function(name, description){
		var self= this;
		if (!wami_initialized){
			document.getElementById(wami_div_id).style.display="";
			Wami.setup({
				id : wami_div_id,
				swfUrl: "/wami/Wami.swf",
				onReady : function(){
					wami_initialized= true;
					/*
					setTimeout(function(){
						document.getElementById(wami_div_id).style.visibility= "hidden";
					}, 1000);*/
					var ws= Wami.getSettings();
					ws.container= "au";
					try{
						Wami.setSettings(ws);	
					}catch(e){
						console.log("wami set settings error");
						console.log(e);
					}
					self.requestChannel(name, description);
				}
			});
		}
		else {
			this.requestChannel(name, description);
		}
	};
	
	SClass.prototype.requestChannel= function(name, description){
		var self= this;
		$.ajax({
			url: '/jscast/start',
			success: function(data) {
				self.start(data.post_url);
			}
		});
	};
	
	SClass.prototype.start= function(url){
		var recording_url= window.location.href.toString().replace(window.location.pathname.toString(), "")+url;
		console.log("Recording url=>"+recording_url);
		Wami.startRecording(recording_url);
        this._send("STARTED");
	};
	
	SClass.prototype.stop= function(){
		Wami.stopRecording();	
		this._send("ENDED");
	};
	
	SClass.prototype._send= function(evt){
        if (evt_handler){
            evt_handler(evt);    
        }
	}
	
	JSCast= new SClass();
})();
  

