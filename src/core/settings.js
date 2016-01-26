import $ from 'jquery';
import topcoat from 'topcoat/css/topcoat-desktop-dark.min.css';
import Settings from 'settings';

const loader = require.context('../', true, /package\.json$/);

class SettingsPage{
	options = new Map();

	constructor(target){
		this.target = $(target);
		this.renderOptions();
		this.loadSettings();
		let self = this;

		$('<div class="save"><button class="topcoat-button--large--cta">Save</button></div>')
			.appendTo(this.target)
			.find('button')
			.click(async function(){
				await self.save();
				$('<div class="saved">กำลังโหลดการตั้งค่าใหม่</div>').appendTo(self.target);
				alert('รีโหลดแท็บ mylive เพื่อใช้การตั้งค่าใหม่');

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

			if(metadata.settings){
				for(let key of Object.keys(metadata.settings)){
					let value = metadata.settings[key];
					let row = this.createInput(value);
					categories.get(category).push(row);
					this.options.set(key, row.find('input'));
				}
			}

			if(!metadata.no_disable){
				let row = this.createCheckbox(metadata.description || metadata.name);
				categories.get(category).push(row);
				this.options.set(metadata.name, row.find('input'));
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
		let row = $('<div />');
		let label = $('<label class="topcoat-switch" />');
		label.prepend('<div class="topcoat-switch__toggle" />');
		let checkbox = $('<input type="checkbox" class="topcoat-switch__input" />')
			.prependTo(label);
		label.appendTo(row);
		$('<span class="label" />').text(name).appendTo(row);

		return row;
	}

	createInput(props){
		if(props.type == 'boolean'){
			return this.createCheckbox(props.label);
		}

		let row = $('<div />');
		let label = $('<label />');
		$('<span class="label" />')
			.text(props.label)
			.appendTo(label);
		let input = $('<input />')
			.addClass('topcoat-text-input')
			.attr('type', props.type)
			.prependTo(label);

		const validProps = ['min', 'max', 'pattern'];
		for(var prop of validProps){
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
					field.attr('checked', settings[key]);
				}else{
					field.val(settings[key]);
				}
			}
		}
	}

	async save(){
		let settings = await Settings.get();
		for(let [key, field] of this.options){
			if(field.attr('type') == 'checkbox'){
				settings[key] = field.prop('checked');
			}else{
				settings[key] = field.val();
				if(field.attr('type') == 'number'){
					settings[key] = parseInt(settings[key], 10);
				}
			}
		}
		return Settings.set(settings);
	}
}

export default new SettingsPage($('#target'));
