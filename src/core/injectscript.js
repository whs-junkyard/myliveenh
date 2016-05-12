export default (script) => {
	let node = document.createElement('script');
	node.innerHTML = script;
	(document.body || document.documentElement).appendChild(node);
};
