import blenderWS from '../libs/BlenderWebSocket';
import * as THREE from 'three.js';

const clock = new THREE.Clock();

let time = 0;
let connected = false;

blenderWS.addListener('time', function(newTime) {
	time = newTime;
	connected = true;
});

export function start() {
	clock.start();
}

export function getTime() {
	if (connected)
		// return clock.getElapsedTime();
		return time;
	else
		return clock.getElapsedTime();
}

export function getDuration() {
	return 100000000;
}