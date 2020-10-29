
const initializeYoutubeApi = () => new Promise((resolve, reject) => {
	const tag = document.createElement('script');
  	tag.id = 'iframe-demo';
  	tag.src = 'https://www.youtube.com/iframe_api';
  	const firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	tag.onerror = reject;
	window.onYouTubeIframeAPIReady = resolve;
});

const initializePlayer = (iframeId, onPlayerStateChange, onError) => {
	let player;

	return () => Promise.resolve().then(
		() => {
			if (!window.YT) {
				return initializeYoutubeApi();
			}
		}
	).then(() => new Promise((resolve, reject) => {
		try {
			if (player) {
				return resolve(player);
			}

			player = new YT.Player(iframeId, {
				events: {
					'onReady': () => {
						resolve(player);
					},
					'onError': onError,
					'onStateChange': onPlayerStateChange
				}
			});
		} catch (error) {
			reject(error);
		}
	}));
};

const initializeVideo = () => {
	const play = document.querySelector('.player__control--play');
	const screensaver = document.querySelector('.player__screen-placeholder');
	const iframe = document.getElementById('video');
	let error = false;

	const onPlayerStateChange = (event) => {
		if (
			event.data == YT.PlayerState.ENDED
		) {
			screensaver.style.display = 'block';
			play.style.display = 'block';
			iframe.classList.add('player__iframe--hidden');
		}
	};

	const getPlayer = initializePlayer('video', onPlayerStateChange, () => {
		error = true;
	});

	play.addEventListener('click', () => {
		getPlayer().then(player => {
			screensaver.style.display = 'none';
			play.style.display = 'none';
			iframe.classList.remove('player__iframe--hidden');
			player.playVideo();
		}).catch(error => {
			console.error(error);
		});
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

const setNotEmptyInputs = () => {
	document.querySelectorAll('.form__input').forEach(input => {
		input.addEventListener('change', (e) => {
			if (e.target.value) {
				e.target.classList.add('form__input--not-empty');
			} else {
				e.target.classList.remove('form__input--not-empty');
			}
		});
	});
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

const toggleClass = (controlId, className, element) => {
	const button = document.getElementById(controlId);
	button.addEventListener('change', (e) => {
		if (e.target.checked) {
			element.classList.add(className);
		} else {
			element.classList.remove(className);
		}
	});
};

const toggleTheme = () => {
	toggleClass('theme-button', 'theme-is-black', document.body);
};

const toggleMenu = () => {
	toggleClass('menu-button', 'navigation--show', document.querySelector('.navigation'));
};

const svgPollyfill = () => {
	if (!/MSIE|Trident/.test(navigator.userAgent)) {
		return;
	}
	
	[].forEach.call(document.querySelectorAll('svg'), svg => {
		const use = svg.querySelector('use'); 
	
		if (use) {
			const object = document.createElement('object');
			object.data = use.getAttribute('xlink:href');
			object.className = svg.getAttribute('class');
			svg.parentNode.replaceChild(object, svg);
		}
	});
};

document.addEventListener('DOMContentLoaded', () => {
	initializeVideo();
	initializeSlider();
	setNotEmptyInputs();
	toggleTheme();
	toggleMenu();
	svgPollyfill();
});
