export default (method, url, body) => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.withCredentials = true;
		xhr.responseType = 'document';
		xhr.onreadystatechange = () => {
			if(xhr.readyState === XMLHttpRequest.DONE){
				if(xhr.status === 200){
					resolve(xhr.responseXML);
				}else{
					reject(xhr);
				}
			}
		};
		xhr.send(body);
	});
};
