// https://docs.angularjs.org/guide/bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

/**
 * Resume paused angular execution
 */
export default function(){
	var script = document.createElement('script');
	script.innerHTML = 'angular.resumeBootstrap();';

	document.body.appendChild(script);
};
