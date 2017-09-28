import BlenderWebSocket from '../utils/blender-web-socket';

let time = 0;
let connected = false;

const blenderWS = new BlenderWebSocket();

blenderWS.addListener('refresh', function() {
	location.reload();
});

blenderWS.addListener('time', function(newTime) {
	time = newTime;
	connected = true;
});

export default function() {
	if (!connected)
		time += 0.016; // TODO

	return time;
}
