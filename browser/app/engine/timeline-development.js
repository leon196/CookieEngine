import blenderWS from '../libs/BlenderWebSocket';
import * as THREE from 'three.js';

const clock = new THREE.Clock();

let time = 0;
let connected = false;

blenderWS.addListener('refresh', function() {
	location.reload();
});

blenderWS.addListener('time', function(newTime) {
	time = newTime;
	connected = true;
});

export function start() {
	clock.start();
}

export function getTime() {
	if (connected)
		return time;
	else
		return clock.getElapsedTime();
}
