'use strict';

const descriptors = require('../browser/asset/descriptors.json');

const { writeFileSync } = require('fs');
const { resolve } = require('path');

const importRegExp = /\W+/g;

function getImportName(name) {
	return name.replace(importRegExp, '_');
}

const imports = {};

function register(url) {
	const importName = getImportName(url);
	imports[importName] = url;
	return importName;
}

var animationsImportName = register(descriptors.animations);

const exportLines = [
	'const plyLoader = new PLYLoader();',
	'const objLoader = new OBJLoader();',
	'const fontLoader = new THREE.FontLoader();',

	'export default {',
	'animations: makeAnimations(JSON.parse(' + animationsImportName + ')),',
	'geometries: {',
];

Object.keys(descriptors.geometries).forEach(name => {
	const url = descriptors.geometries[name].file;

	const infos = url.split('.');
	const extension = infos[infos.length - 1];
	switch (extension) {
	case 'obj': {
		const importName = register(url);
		exportLines.push(name + ': objLoader.parse(' + importName + '),');
		break;
	}
	case 'ply': {
		const importName = register(url);
		exportLines.push(name + ': plyLoader.parse(' + importName + '),');
		break;
	}
	default:
		throw new Error('Unknown extension ' + extension);
	}
});

exportLines.push(
	'},',
	'fonts: {'
);

Object.keys(descriptors.fonts).forEach(name => {
	const url = descriptors.fonts[name].file;

	const importName = register(url);
	exportLines.push(name + ': fontLoader.parse(' + importName + '),');
});

exportLines.push(
	'},',
	'shaders: {'
);

Object.keys(descriptors.shaders).forEach(name => {
	const vertexShaderUrl = descriptors.shaders[name].vertexShader;
	const fragmentShaderUrl = descriptors.shaders[name].fragmentShader;

	const vertexShaderImportName = register(vertexShaderUrl);
	const fragmentShaderImportName = register(fragmentShaderUrl);
	exportLines.push(
		name + ': new THREE.ShaderMaterial(Object.assign({}, descriptors.shaders.' + name + ', {',
		'vertexShader: shaderHeader + ' + vertexShaderImportName + ',',
		'fragmentShader: shaderHeader + ' + fragmentShaderImportName + ',',
		'uniforms: uniforms,',
		'})),'
	);
});

exportLines.push(
	'},',
	'load: function(callback) { return callback(); }',
	'};'
);

const lines = [
	'/* eslint-disable */',
	'/* This file is generated with "npm run assets", do not edit by hand. */',
	'import descriptors from "../../asset/descriptors.json!";',
	'import makeAnimations from "./make-animations";',
	'import uniforms from "./uniforms";',
	'import { OBJLoader } from "../libs/OBJLoader";',
	'import { PLYLoader } from "../libs/PLYLoader";',
	'import * as THREE from "three.js";',
	'import shaderHeader from "../../asset/shader/header.glsl!text";',
]
	.concat(Object.keys(imports).sort().map(importName => 'import ' + importName + ' from "../../asset/' + imports[importName] + '!text";'))
	.concat(exportLines);

writeFileSync(resolve(__dirname, '..', 'browser', 'app', 'engine', 'assets.js'), lines.join('\n'));
