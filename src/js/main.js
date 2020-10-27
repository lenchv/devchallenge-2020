
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

const getNumber = (str) => {
	const num = String(str).match('/(\d+)/');

	if (!Array.isArray(num)) {
		return 0;
	}

	return +num[1];
};

const updateArrowState = (arrow, condition) => {
	const disabledClass = 'slider-controls__arrow--disabled';

	if (condition) {
		arrow.classList.add(disabledClass);
	} else if (arrow.classList.contains(disabledClass)) {
		arrow.classList.remove(disabledClass);
	}
};

const initializeSlider = () => {
	const slideNumber = document.querySelector('.slider-controls__current-number');
	const arrowLeft = document.querySelector('.slider-controls__arrow--left');
	const arrowRight = document.querySelector('.slider-controls__arrow--right');
	const sliderContainer = document.querySelector('.slider__container');

	const SLIDE_WIDTH = 468;
	const GUTTER_WIDTH = 10;
	const SLIDE_OFFSET = SLIDE_WIDTH + (GUTTER_WIDTH * 2);
	const COUNT_OF_SLIDES = sliderContainer.querySelectorAll('.slider__slide').length;

	let slide = getNumber(slideNumber.innerText) || 1;

	const moveTo = (slide) => {
		const offset = SLIDE_OFFSET * (slide - 1);

		sliderContainer.style.marginLeft = `${-offset}px`;
		slideNumber.innerText = `${slide}`;

		updateArrowState(arrowLeft, slide === 1);
		updateArrowState(arrowRight, slide === COUNT_OF_SLIDES);
	};

	arrowRight.addEventListener('click', (e) => {
		if (slide >= COUNT_OF_SLIDES) {
			return;
		}

		moveTo(++slide);
	});

	arrowLeft.addEventListener('click', (e) => {
		if (slide <= 1) {
			return;
		}

		moveTo(--slide);
	});
};

document.addEventListener('DOMContentLoaded', () => {
	initializeYoutubeApi().then(onYoutubeReady);
	initializeSlider();
});
