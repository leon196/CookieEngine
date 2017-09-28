import blenderWS from '../libs/BlenderWebSocket';

let time = 0;
let connected = false;

blenderWS.addListener('refresh', function() {
	location.reload();
});

blenderWS.addListener('time', function(newTime) {
	time = newTime;
	connected = true;
});

export default function() {
	if (!connected)
		time += 0.016;

	return time;
}
