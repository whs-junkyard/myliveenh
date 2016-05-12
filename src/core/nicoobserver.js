export default class NicoObserver{
	constructor(){
		if(this.getTarget() === null){
			return;
		}

		this.observer = new MutationObserver(this.onMutated.bind(this));
		this.observer.observe(this.getTarget(), {
			childList: true,
		});
	}

	getTarget(){
		return document.getElementById('nicochat');
	}

	onMutated(records){
		for(let record of records){
			this.processMutation(record);
		}
	}

	processMutation(record){
		if(record.addedNodes.length === 0){
			return;
		}
		let node = record.addedNodes[0];
		this.processChatNode(node);
	}

	processChatNode(node){
	}
}
