import * as THREE from 'three.js'
import '../utils/loader'
import { parameter } from '../editor/parameter'
import { PLYLoader } from '../utils/PLYLoader'
import { OBJLoader } from '../utils/OBJLoader'

var baseURL = "asset/";
var shaderBaseURL = baseURL + 'shader/';

var textureDescriptors = {
	// 'panorama': "images/Room.jpg",
};

var meshDescriptors = {
	// 'building1': "meshes/building1.ply",
};

var geometryDescriptors = {
	// 'vegetation': 'points/vegetation.ply',
	'tree': 'point/tree.obj',
	'branch': 'point/branch.obj',
};

var shaderDescriptors = {
	'particle.vert': 'particle.vert',
	'particle.frag': 'particle.frag',
	'text.vert': 'text.vert',
	'text.frag': 'text.frag',
	'position.frag': 'position.frag',
	'velocity.frag': 'velocity.frag',
	'line.vert': 'line.vert',
	'line.frag': 'line.frag',
	'point.frag': 'point.frag',
	'point.vert': 'point.vert',
	'screen.vert': 'screen.vert',
};

var fontDescriptors = {
	'helvetiker' : 'font/helvetiker_bold.typeface.json',
}

var pendingCallbacks = [];
var isLoaded = false;

function load(callback) {
	if (isLoaded) {
		return setTimeout(function() {
			return callback(asset);
		});
	}

	return pendingCallbacks.push(callback);
}

export var asset = {
	// 'actions': new blenderHTML5Animations.ActionLibrary(actionsDescriptor),
	'load': load,
	'geometry': {},
	'font': {},
	'textures': {}
};

function notify() {
	isLoaded = asset.shaders 
	// && Object.keys(asset.textures).length == Object.keys(textureDescriptors).length 
	&& Object.keys(asset.font).length == Object.keys(fontDescriptors).length 
	&& Object.keys(asset.geometry).length == Object.keys(geometryDescriptors).length;
	// && asset.meshes;

	if (isLoaded) {
		return pendingCallbacks.forEach(function(callback) {
			return callback();
		});
	}
}

var shaderURLs = [
	// "header.glsl",
	// "uniforms.glsl",
	// "modifiers.glsl",
	"utils.glsl",
	"displace.glsl",
	// "hg_sdf.glsl",
].map(function(name) {
	return shaderBaseURL + name;
});

Object.keys(shaderDescriptors).forEach(function(name) {
	var url = shaderDescriptors[name];
	shaderURLs.push( shaderBaseURL + url );
});

var parameterList = 'uniform float ';
var keys = Object.keys(parameter);
var count = keys.length;
for (var i = 0; i < count; ++i) {
	parameterList += keys[i] + (i+1!=count?', ':';');
}

asset.fileLoaded = {};

function fileWithHeaders(name) {
	return asset.fileLoaded[shaderBaseURL + "utils.glsl"]
	// + asset.fileLoaded[shaderBaseURL + "displace.glsl"]
	+ parameterList + asset.fileLoaded[name];
}

loadFiles(shaderURLs, function (err, files) {
	if (err) throw err;

	asset.fileLoaded = files;

	var shaders = {};
	Object.keys(shaderDescriptors).forEach(function(name) {
		var url = shaderDescriptors[name];
		shaders[name] = fileWithHeaders(shaderBaseURL + url);
	});

	asset.shaders = shaders;
	return notify();
});

asset.reload = function (assetName, callback) {
	loadFiles([shaderBaseURL + assetName], function (err, files) {
		asset.fileLoaded[shaderBaseURL + assetName] = files[shaderBaseURL + assetName];
		asset.shaders[assetName] = fileWithHeaders(shaderBaseURL + shaderDescriptors[assetName]);
		if (callback != null) callback();
	});
};

// var textureLoader = new THREE.TextureLoader();
// Object.keys(textureDescriptors).forEach(function(name) {
// 	textureLoader.load(textureDescriptors[name], function(texture) {
// 		asset.textures[name] = texture;
// 		return notify();
// 	});
// });


var plyLoader = new PLYLoader();
var objLoader = new OBJLoader();

var meshURLs = [];
Object.keys(geometryDescriptors).forEach(function(name) {
	var url = baseURL + geometryDescriptors[name];
	var infos = url.split('.');
	var extension = infos[infos.length-1];
	if (extension == 'ply') {
		plyLoader.load(url, function(geometry){
			asset.geometry[name] = geometry;
			return notify();
		});
	} else if (extension == 'obj') {
		objLoader.load(url, function(geometry){
			asset.geometry[name] = geometry;
			return notify();
		});
	}
});


var fontLoader = new THREE.FontLoader();
Object.keys(fontDescriptors).forEach(function(name) {
	var url = baseURL + fontDescriptors[name];
	fontLoader.load(url, function(font){
			asset.font[name] = font;
			return notify();
		});
});