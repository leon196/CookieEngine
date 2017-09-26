import io from 'socket.io-client/dist/socket.io';
import { asset } from '../editor/asset';
import { material } from '../editor/material';

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
		if (material[name] != null) {
			asset.reload(fileName, function () {
				if (extension == 'frag') {
					material[name].fragmentShader = asset.shaders[fileName];
				} else {
					material[name].vertexShader = asset.shaders[fileName];
				}
				material[name].needsUpdate = true;
			});
		}
	}
}

connect();

export default socket;
