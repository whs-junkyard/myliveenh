(function(){

var _addlog = window.addlog;
window.addlog = function(data){
	_addlog.apply(this, arguments);

	if(nicoOn && data.role == "g"){
		nicoPush(data.msg.msg, "#efefef");
	}
};

})();