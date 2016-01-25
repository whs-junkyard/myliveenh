export default (script) => {
	let node = document.createElement('script');
	node.innerHTML = script;
	document.body.appendChild(node);
};
