export default (blob) => {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = function(e){
			resolve(e.target.result);
		};
		reader.onerror = function(e){
			reject(e);
		};
		reader.readAsArrayBuffer(blob);
	});
};