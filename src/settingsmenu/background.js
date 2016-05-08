chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(!request.settingsmenu){
		return;
	}

	switch(request.settingsmenu){
	case 'settings':
		chrome.runtime.openOptionsPage();
		return true;
	default:
		console.error('Unknown background page request for settingsmenu');
	}
});
