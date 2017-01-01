import injectScript from 'core/injectscript';

// find the element AFTER vue
const TARGET = 'http://s.mylive.in.th/asset/vuejs/vue-resource.js';

let onMutation = function(records){
	for(let record of records){
		if(record.target.tagName === 'BODY'){
			// failsafe
			observer.disconnect();
			return;
		}

		for(let children in record.addedNodes){
			children = record.addedNodes[children];
			if(children.tagName === 'SCRIPT' && (children.getAttribute('src') || '').indexOf(TARGET) !== -1){
				console.log('[L+] Vue found');
				observer.disconnect();
				// try to prevent vue._init from firing
				injectScript(`(function(){
					let pendingVueEl = [];
					let originalVueInit = Vue.prototype._init;
					Vue.prototype._init = function(options){
						pendingVueEl.push([this, options.el]);
						delete options.el;
						originalVueInit.call(this, options);
					}
					window.enh__triggerVueInits = function(){
						console.log('[L+] Trigger pending '+pendingVueEl.length+' Vue mounts');
						for(let item of pendingVueEl){
							item[0].$mount(item[1]);
						}
						delete pendingVueEl;
						Vue.prototype._init = originalVueInit;
					}
				})();`);
			}
		}
	}
};

let observer = new MutationObserver(onMutation);
observer.observe(document.documentElement, {
	childList: true,
	subtree: true,
});
