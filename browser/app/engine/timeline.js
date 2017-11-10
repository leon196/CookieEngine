// import * as THREE from 'three.js';
// const clock = new THREE.Clock();

const music = document.getElementById('music');
music.load();

// var musicTime = true;

export function start() {
	music.play();
	// music.addEventListener('ended', function() {
	// 	musicTime = false;
	// 	clock.start();
	// })
}

export function getTime() {
	// if (musicTime) {
		return music.currentTime;
	// } else {
		// return clock.getElapsedTime();
	// }
}
