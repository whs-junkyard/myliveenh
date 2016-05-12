export default class ChatObserver{
	constructor(){
		this.observer = new MutationObserver(this.onMutated.bind(this));
		this.observer.observe(this.getTarget(), {
			childList: true,
			subtree: true,
		});
	}

	getTarget(){
		return document.getElementById('logmain');
	}

	onMutated(records){
		for(let record of records){
			this.processMutation(record);
		}
	}

	processMutation(record){
		if(record.type !== 'childList' || record.addedNodes.length === 0){
			return;
		}
		let node = record.addedNodes[0];
		if(node.tagName !== 'LI' || !node.id.startsWith('log')){
			return;
		}
		this.processChatNode(node);
	}

	processChatNode(node){
	}
}
