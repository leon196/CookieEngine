import * as THREE from 'three.js'
import '../utils/loader'
import { parameter } from '../editor/parameter'
import { PLYLoader } from '../utils/PLYLoader'
import { OBJLoader } from '../utils/OBJLoader'

export var asset = {
	// 'actions': new blenderHTML5Animations.ActionLibrary(actionsDescriptor),
	'load': load,
	'shader': {},
	'geometry': {},
	'font': {},
	'textures': {}
};

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
	'flash': 'point/flash.obj',
};

asset.shaderDescriptors = {
	'particle.vert': 'triangle/particle.vert',
	'particle.frag': 'triangle/particle.frag',
	'text.vert': 'triangle/text.vert',
	'text.frag': 'triangle/text.frag',
	'line.vert': 'triangle/line.vert',
	'line.frag': 'triangle/line.frag',
	'point.frag': 'triangle/point.frag',
	'point.vert': 'triangle/point.vert',
	'screen.vert': 'filter/screen.vert',
	'filter.frag': 'filter/filter.frag',
	'position.frag': 'pass/position.frag',
	'velocity.frag': 'pass/velocity.frag',
};

var sceneShaderNames = ['snow', 'tree', 'rain', 'smoke', 'flash', 'fire', 'label'];
for (var i = 0; i < sceneShaderNames.length; ++i) {
	var name = sceneShaderNames[i];
	asset.shaderDescriptors[name + '.vert'] = 'scene/' + name + '.vert';
	asset.shaderDescriptors[name + '.frag'] = 'scene/' + name + '.frag';
}

var fontDescriptors = {
	'helvetiker' : 'font/helvetiker_bold.typeface.json',
	'Kanit' : 'font/Kanit_Bold.json',
	// 'SoukouMincho' : 'font/SoukouMincho_Regular.json',
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

function notify() {
	isLoaded = asset.shader 
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

Object.keys(asset.shaderDescriptors).forEach(function(name) {
	var url = asset.shaderDescriptors[name];
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
	Object.keys(asset.shaderDescriptors).forEach(function(name) {
		var url = asset.shaderDescriptors[name];
		shaders[name] = fileWithHeaders(shaderBaseURL + url);
	});

	asset.shader = shaders;
	return notify();
});

asset.reloadShader = function (assetName, callback) {
	loadFiles([shaderBaseURL + assetName], function (err, files) {
		asset.fileLoaded[shaderBaseURL + assetName] = files[shaderBaseURL + assetName];
		var infos2 = assetName.split('/');
		var fileName = infos2[infos2.length - 1];
		asset.shader[fileName] = fileWithHeaders(shaderBaseURL + asset.shaderDescriptors[fileName]);
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