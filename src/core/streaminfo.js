import htmlXhr from './htmlxhr';

export default async function(id){
	let html = await htmlXhr('GET', `http://mylive.in.th/streams/${id}`);
	let body = html.documentElement.innerHTML;

	let rtmp, hls, poster;
	try{
		rtmp = body.match(/(rtmp:\/\/[^"]+)/i)[0];
	}catch(e){/* continue */}
	try{
		hls = body.match(/(http:\/\/stream[^"]+\.m3u8)/i)[0];
	}catch(e){/* continue */}
	try{
		poster = body.match(/image: "([^"]+)"/i)[1];
	}catch(e){/* continue */}

	return {
		rtmp: rtmp,
		hls: hls,
		poster: poster,
		avatar: html.querySelector('.owner').getAttribute('src'),
	};
}
