import Settings from 'settings';
import resume from 'core/resume_angular';

export default (plugin, cb, resumeAngular) => {
	return Settings.get().then(function(settings){
		if(settings[plugin] && !window[`__enh_${plugin}`]){
			window[`__enh_${plugin}`] = true;
			cb();
		}else if(resumeAngular){
			resume();
		}
	});
};
