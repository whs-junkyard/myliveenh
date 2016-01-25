export default async function(id){
	let body = await fetch(`http://mylive.in.th/streams/${id}`, {
		credentials: 'include'
	}).then((res) => res.text());
	return body.match(/(rtmp:\/\/[^"]+)/i)[0];
}
