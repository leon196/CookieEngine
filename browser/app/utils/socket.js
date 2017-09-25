import io from 'socket.io-client/dist/socket.io';
import { assets } from '../editor/assets';
import { materials } from '../editor/materials';

let socket;

function connect() {
	socket = io('http://localhost:5776');
	socket.on('add', function (data) { console.log('added', data.path); });
	socket.on('change', change);
	socket.on('disconnect', connect);
}

function change(data) {
	console.log('changed', data.path);
	var infos1 = data.path.split('.');
	var infos2 = data.path.split('/');
	var extension = infos1[infos1.length - 1];
	var fileName = infos2[infos2.length - 1];
	var name = fileName.split('.')[0];
	if (extension == 'frag' || extension == 'vert') {
		if (materials[name] != null) {
			assets.reload(fileName, function () {
				if (extension == 'frag') {
					materials[name].fragmentShader = assets.shaders[fileName];
				} else {
					materials[name].vertexShader = assets.shaders[fileName];
				}
				materials[name].needsUpdate = true;
			});
		}
	}
}

connect();

export default socket;
