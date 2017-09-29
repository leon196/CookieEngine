import demo from './demo';

let started = false;

function start(event) {
	event.preventDefault();

	if (!started) {
		started = true;

		document.getElementById('message').remove();

		setTimeout(demo, 0);
	}
}

addEventListener('click', start);
