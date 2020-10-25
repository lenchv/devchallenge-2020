
const initializeYoutubeApi = () => new Promise((resolve, reject) => {
	const tag = document.createElement('script');
  	tag.id = 'iframe-demo';
  	tag.src = 'https://www.youtube.com/iframe_api';
  	const firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	tag.onerror = reject;
	window.onYouTubeIframeAPIReady = resolve;
});

const onYoutubeReady = () => {
	const play = document.querySelector('.player__control--play');
	const screensaver = document.querySelector('.player__screen-placeholder');
	let ready = false;
	let error = false;

	const onPlayerStateChange = (event) => {
		if (
			event.data == YT.PlayerState.ENDED
		) {
			screensaver.style.display = 'block';
			play.style.display = 'block';
		}
	};
	const player = new YT.Player('video', {
        events: {
		'onReady': () => {
			ready = true;
		},
		'onError': () => {
			error = true;
		},
		  'onStateChange': onPlayerStateChange
        }
	});
	play.addEventListener('click', () => {
		if (error) {
			openInNewTab(player.getVideoUrl());
			return;
		}

		if (!ready) {
			return;
		}

		screensaver.style.display = 'none';
		play.style.display = 'none';
		player.playVideo();
	});
};

const openInNewTab = (url) => {
	var win = window.open(url, '_blank');
	win.focus();
}

document.addEventListener('DOMContentLoaded', () => {
	initializeYoutubeApi().then(onYoutubeReady);
});
