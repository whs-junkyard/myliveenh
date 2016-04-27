import injectScript from 'core/injectscript';

/**
 * Resume paused angular execution
 */
export default function(){
	injectScript(`angular.resumeBootstrap();
	if(window.socket && window.socket.connected){
		window.socket.emit('connect');
	}`);
};
