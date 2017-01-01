import injectScript from 'core/injectscript';

/**
 * Resume paused angular execution
 */
export default function(){
	injectScript(`window.enh__triggerVueInits(); delete window.enh__triggerVueInits;`);
}
