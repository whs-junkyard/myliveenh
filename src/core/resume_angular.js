/**
 * Resume paused angular execution
 */
export default function(){
	var script = document.createElement('script');
	script.innerHTML = 'angular.resumeBootstrap();';

	document.body.appendChild(script);
};
