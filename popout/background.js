chrome.runtime.onMessageExternal.addListener((message, sender, response) => {
	chrome.app.window.create(`popout.html`, {
		frame: 'none',
		id: `${message.id}-video`,
		alwaysOnTop: true,
	}, (wnd) => {
		wnd.contentWindow.addEventListener('DOMContentLoaded', () => {
			wnd.contentWindow.showVideo(message);
		});
	});
});
