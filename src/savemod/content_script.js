import $ from 'jquery';
import injectScript from 'core/injectscript';
import plugin from 'core/plugin';
import Settings from '../settings';

plugin('savemod', async function(){
	let settings = await Settings.get();
	let modList = settings.modList;

	if(Array.isArray(modList) && modList.length > 0){
		injectScript(`(function(){
			var addMod = function(){
				if(!angular.element('#chatMain').scope().modtool){
					return;
				}
				var mods = ${JSON.stringify(modList)};
				for(var i = 0; i < mods.length; i++){
					socket.emit('addmod', mods[i]);
				}
			}
			if(!socket.connected){
				socket.on('connected', addMod);
			}else{
				addMod();
			}
		})();`);
	}

	let banList = settings.banList;

	if(Array.isArray(banList) && banList.length > 0){
		injectScript(`(function(){
			var addBan = function(){
				if(!angular.element('#chatMain').scope().modtool){
					return;
				}
				var banned = ${JSON.stringify(banList)};
				for(var i = 0; i < banned.length; i++){
					socket.emit('addban', banned[i]);
				}
			}
			if(!socket.connected){
				socket.on('connected', addBan);
			}else{
				addBan();
			}
		})();`);
	}
}, {
	id: 'savemod2'
});
