import $ from 'jquery';
import topcoat from 'topcoat/css/topcoat-desktop-dark.min.css'; // eslint-disable-line no-unused-vars
import Settings from 'settings';
import EmoteSettings from 'emotepack/emotesettings';

const loader = require.context('../', true, /package\.json$/);

class SettingsPage{
	options = new Map();

	constructor(target){
		this.target = $(target);
		this.renderOptions();
		this.loadSettings();
		this.loadDonate();
		let self = this;

		$('<div class="save"><button class="topcoat-button--large--cta">Save</button></div>')
			.appendTo(this.target)
			.find('button')
			.click(async function(){
				await self.save();
				$('<div class="saved">กำลังโหลดการตั้งค่าใหม่</div>').appendTo(self.target);
				alert('รีโหลดแท็บ MyLive เพื่อใช้การตั้งค่าใหม่');

				setTimeout(() => {
					chrome.runtime.reload();
				}, 500);
			});
	}

	renderOptions(){
		let categories = new Map();
		categories.set('', []);

		for(let module of loader.keys()){
			let metadata = loader(module);
			let category = metadata.category || '';
			if(!categories.has(category)){
				categories.set(category, []);
			}
			let children = [];

			if(!metadata.no_disable){
				let row = this.createCheckbox(metadata.description || metadata.name);
				if(metadata.description2){
					$('<div class="label2" />')
						.text(metadata.description2)
						.appendTo(row);
				}
				categories.get(category).push(row);
				this.options.set(metadata.name, row.find('input'));
				row.find('input').on('change', function(){
					for(let item of children){
						item.prop('disabled', !this.checked);
					}
				});
			}

			if(metadata.settings){
				for(let key of Object.keys(metadata.settings)){
					let value = metadata.settings[key];
					let row = this.createInput(value);

					if(value.help_text){
						$('<div class="label2" />')
							.text(value.help_text)
							.appendTo(row);
					}

					categories.get(category).push(row);
					this.options.set(key, row.find('input'));
					children.push(row.find('input'));
				}
			}
		}

		for(let [name, value] of categories){
			$('<h3 />').text(name).appendTo(this.target);
			let target = $('<div />');

			for(let item of value){
				item.appendTo(target);
			}

			target.appendTo(this.target);
		}
	}

	createCheckbox(name){
		let row = $('<div class="option" />');
		let label = $('<label class="topcoat-switch" />');
		label.prepend('<div class="topcoat-switch__toggle" />');
		$('<input type="checkbox" class="topcoat-switch__input" />')
			.prependTo(label);
		label.appendTo(row);
		$('<span class="label" />').text(name).appendTo(row);

		return row;
	}

	createInput(props){
		if(props.type === 'boolean'){
			return this.createCheckbox(props.label);
		}

		let row = $('<div class="option" />');
		let label = $('<label />');
		$('<span class="label" />')
			.text(props.label)
			.appendTo(label);
		let input = $('<input />')
			.addClass('topcoat-text-input')
			.attr('type', props.type)
			.prependTo(label);

		const validProps = ['min', 'max', 'pattern', 'step'];
		for(let prop of validProps){
			if(props[prop] !== undefined){
				input.attr(prop, props[prop]);
			}
		}

		label.appendTo(row);
		$('<span class="label" />').text(name).appendTo(row);

		return row;
	}

	async loadSettings(){
		let settings = await Settings.get();
		for(let key of Object.keys(settings)){
			let field = this.options.get(key);
			if(field){
				// regenerator fail to compile if(!field) continue
				if(field.attr('type') === 'checkbox'){
					field.attr('checked', settings[key]).trigger('change');
				}else{
					field.val(settings[key]).trigger('change');
				}
			}
		}
	}

	async save(){
		let settings = await Settings.get();
		for(let [key, field] of this.options){
			if(field.attr('type') === 'checkbox'){
				settings[key] = field.prop('checked');
			}else{
				settings[key] = field.val();
				if(field.attr('type') === 'number'){
					settings[key] = parseFloat(settings[key], 10);
				}
			}
		}
		return Settings.set(settings);
	}

	async loadDonate(){
		let donate = await (fetch('https://myliveenh.cupco.de/donate.json').then((data) => data.json()));
		let tbody = $('#donate tbody');

		for(let item of donate){
			let row = $('<tr></tr>');
			if(item.link){
				let td = $('<td />').appendTo(row);
				$('<a target="_blank" />').attr('href', item.link).text(item.name).appendTo(td);
			}else{
				$('<td />').text(item.name).appendTo(row);
			}

			if(item.value === null){
				$('<td />').text('').appendTo(row);
			}else{
				$('<td />').text(item.value).appendTo(row);
			}

			row.appendTo(tbody);
		}
	}
}

new EmoteSettings($('#emotes'));
export default new SettingsPage($('#target'));
