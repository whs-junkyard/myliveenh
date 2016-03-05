import Settings from 'settings';
import resume from 'core/resume_angular';

if(!window['plugin_loaded']){
	window.plugin_loaded = [];
	window.angular_count = 0;
}

export default (plugin, cb, options) => {
	options = options || {};

	if(window.plugin_loaded[plugin]){
		return;
	}

	window.plugin_loaded[plugin] = true;
	if(options.resume_angular){
		if(window.angular_count === 0){
			console.time('stop_angular');
		}
		window.angular_count++;
		console.log('[L+] Angular lock+', window.angular_count, plugin);
	}

	let load = () => {
		cb();
		after_load();
	};

	let after_load = () => {
		if(options.resume_angular){
			window.angular_count--;
			console.log('[L+] Angular lock-', window.angular_count, plugin);
			if(window.angular_count === 0){
				console.log('[L+] Resuming angular');
				console.timeEnd('stop_angular');
				resume();
			}
		}
	}

	if(options.always_load){
		load();
	}else{
		if(!window.settings_promise){
			window.settings_promise = Settings.get();
		}
		window.settings_promise.then((settings) => {
			if(settings[plugin]){
				load();
			}else{
				after_load();
			}
		});
	}
};
