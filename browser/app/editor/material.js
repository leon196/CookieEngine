

import * as THREE from 'three.js'
import { asset } from '../editor/asset';

export var material = {};

var materialFromShaderNames = [ 'particle', 'text', 'line', 'point', 'snow', 'tree', 'rain' ];
var materialAlphaFromShaderNames = [ 'smoke', 'flash', 'fire', 'label' ];
var materialScreenFromShaderNames = [ 'position', 'velocity', 'filter' ];

material.defaultUniforms = {
	time: { value: 1.0 },
	frameBuffer: { value: 0 },
	resolution: { value: [window.innerWidth, window.innerHeight] },
	blendLabelFire: { value: 0 },
	blendLabelAlpha: { value: 0 },
	blendStorm: { value: 0 },
	blendLight: { value: 0 },
};

material.setup = function ()
{
	for (var i = materialFromShaderNames.length - 1; i >= 0; i--) {
		var name = materialFromShaderNames[i];
		material[name] = new THREE.ShaderMaterial( {
			uniforms: material.defaultUniforms,
			vertexShader: asset.shader[name+'.vert'],
			fragmentShader: asset.shader[name+'.frag'],
			side: THREE.DoubleSide
		})	
	}
	for (var i = materialAlphaFromShaderNames.length - 1; i >= 0; i--) {
		var name = materialAlphaFromShaderNames[i];
		material[name] = new THREE.ShaderMaterial( {
			uniforms: material.defaultUniforms,
			vertexShader: asset.shader[name+'.vert'],
			fragmentShader: asset.shader[name+'.frag'],
			side: THREE.DoubleSide,
			depthTest: false,
			opacity: .5,
			transparent: true,
		})	
	}
	
	for (var i = materialScreenFromShaderNames.length - 1; i >= 0; i--) {
		var name = materialScreenFromShaderNames[i];
		material[name] = new THREE.ShaderMaterial( {
			uniforms: material.defaultUniforms,
			vertexShader: asset.shader['screen.vert'],
			fragmentShader: asset.shader[name+'.frag']
		})	
	}

	material.loadingText = new THREE.ShaderMaterial( {
		uniforms: material.defaultUniforms,
		vertexShader: asset.shader['text.vert'],
		fragmentShader: asset.shader['text.frag'],
		side: THREE.DoubleSide
	})
}