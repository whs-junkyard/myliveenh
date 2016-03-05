import injectScript from 'core/injectscript';

// mylivechat2 has an angular.bootstrap call, which cause normal stop_angular to fail
const TARGET = 'mylivechat2.js';

let onMutation = function(records){
	for(let record of records){
		if(record.target.tagName != 'HEAD'){
			return;
		}
		if(record.target.tagName == 'BODY'){
			// ensure that we will always disconnect even if detection fail
			observer.disconnect();
			return;
		}

		for(let children in record.addedNodes){
			children = record.addedNodes[children];
			if(children.tagName == 'SCRIPT' && (children.getAttribute('src')||'').indexOf(TARGET) != -1){
				console.log('[L+] mylivechat2 found');
				observer.disconnect();
				// this script try to identify angular.bootstrap(null, ['chat']) call
				// (the call in question is in fact, useless, as ng-app is already used to
				// initialize chat module.)
				injectScript(`(function(){
					var bootstrap = angular.bootstrap;
					angular.bootstrap = function(){
						if(
							arguments.length == 2 &&
							arguments[0] == null &&
							arguments[1].indexOf('chat') != -1
						){
							return;
						}
						bootstrap.apply(null, arguments);
					};
				})();`);
			}
		}
	}
};

let observer = new MutationObserver(onMutation);
observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});
