import injectScript from 'core/injectscript';

/**
 * Resume paused angular execution
 */
export default function(){
	injectScript('angular.resumeBootstrap();');
};
