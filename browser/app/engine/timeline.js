import * as THREE from 'three.js';

const clock = new THREE.Clock();
const music = document.getElementById('music');
music.load();

export function start() {
	clock.start();
	music.play();
}

export function getTime() {
	if (music.currentTime < music.duration) {
		return music.currentTime;
	} else {
		return clock.getElapsedTime();
	}
}

export function getDuration() {
	return music.duration;
}