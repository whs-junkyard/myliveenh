import $ from 'jquery';
import injectScript from 'core/injectscript';
import plugin from 'core/plugin';
import Settings from '../settings';

plugin('savemod', () => {
	$('<input type="button" value="Save to MyLive Enh" id="enh__save_mod" />')
		.insertAfter('.usermute input[ng-click="addmod2()"]')
	$(document).on('click', '#enh__save_mod', (e) => {
		let element = e.target;
		let key = 'enh_savemod__' + Math.random().toString();
		injectScript(`(function(){
			var modlist = angular.element('#chatMain').scope().modlist.map(function(item){
				return item.n;
			});
			window.postMessage({
				${JSON.stringify(key)}: modlist
			}, '*');
		})();`);

		let event = async function(e){
			if(e.source != window){
				return;
			}

			if(Array.isArray(e.data[key])){
				window.removeEventListener('message', event, false);

				let settings = await Settings.get();
				settings.modList = e.data[key];
				await Settings.set(settings);
				element.value = e.data[key].length + ' mods saved to MyLive Enh';
			}
		};
		window.addEventListener('message', event, false);
	});

	$('<input type="button" value="Save to MyLive Enh" id="enh__save_ban" />')
		.insertAfter('.usermute input[ng-click="addban2()"]')
	$(document).on('click', '#enh__save_ban', (e) => {
		let element = e.target;
		let key = 'enh_savemod__' + Math.random().toString();
		injectScript(`(function(){
			var banlist = angular.element('#chatMain').scope().banlist.map(function(item){
				return item.n;
			});
			window.postMessage({
				${JSON.stringify(key)}: banlist
			}, '*');
		})();`);

		let event = async function(e){
			if(e.source != window){
				return;
			}

			if(Array.isArray(e.data[key])){
				window.removeEventListener('message', event, false);

				let settings = await Settings.get();
				settings.banList = e.data[key];
				await Settings.set(settings);
				element.value = e.data[key].length + ' banneds saved to MyLive Enh';
			}
		};
		window.addEventListener('message', event, false);
	});
}, {
	resume_angular: true,
});
