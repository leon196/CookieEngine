

import * as THREE from 'three.js'
import { asset } from '../editor/asset';

export var material = {};

var materialFromShaderNames = [ 'position', 'velocity' ];

var defaultUniforms = {
	time: { value: 1.0 },
	frameBuffer: { value: 0 },
	resolution: { value: [window.innerWidth, window.innerHeight] },
};

material.setup = function ()
{
	for (var i = materialFromShaderNames.length - 1; i >= 0; i--) {
		var name = materialFromShaderNames[i];
		material[name] = new THREE.ShaderMaterial( {
			uniforms: defaultUniforms,
			vertexShader: asset.shaders['screen.vert'],
			fragmentShader: asset.shaders[name+'.frag']
		})	
	}

	material.particle = new THREE.ShaderMaterial( {
		uniforms: defaultUniforms,
		vertexShader: asset.shaders['particle.vert'],
		fragmentShader: asset.shaders['particle.frag'],
		side: THREE.DoubleSide
	})

	material.text = new THREE.ShaderMaterial( {
		uniforms: defaultUniforms,
		vertexShader: asset.shaders['text.vert'],
		fragmentShader: asset.shaders['text.frag'],
		side: THREE.DoubleSide
	})

	material.line = new THREE.ShaderMaterial( {
		uniforms: defaultUniforms,
		vertexShader: asset.shaders['line.vert'],
		fragmentShader: asset.shaders['line.frag'],
		side: THREE.DoubleSide
	})

	material.point = new THREE.ShaderMaterial( {
		uniforms: defaultUniforms,
		vertexShader: asset.shaders['point.vert'],
		fragmentShader: asset.shaders['point.frag'],
		side: THREE.DoubleSide
	})
}