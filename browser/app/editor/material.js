

import * as THREE from 'three.js'
import { asset } from '../editor/asset';

export var material = {};

var materialFromShaderNames = [ 'position', 'velocity' ];

material.defaultUniforms = {
	time: { value: 1.0 },
	frameBuffer: { value: 0 },
	resolution: { value: [window.innerWidth, window.innerHeight] },
};

material.setup = function ()
{
	for (var i = materialFromShaderNames.length - 1; i >= 0; i--) {
		var name = materialFromShaderNames[i];
		material[name] = new THREE.ShaderMaterial( {
			uniforms: material.defaultUniforms,
			vertexShader: asset.shader['screen.vert'],
			fragmentShader: asset.shader[name+'.frag']
		})	
	}

	material.particle = new THREE.ShaderMaterial( {
		uniforms: material.defaultUniforms,
		vertexShader: asset.shader['particle.vert'],
		fragmentShader: asset.shader['particle.frag'],
		side: THREE.DoubleSide
	})

	material.text = new THREE.ShaderMaterial( {
		uniforms: material.defaultUniforms,
		vertexShader: asset.shader['text.vert'],
		fragmentShader: asset.shader['text.frag'],
		side: THREE.DoubleSide
	})

	material.loadingText = new THREE.ShaderMaterial( {
		uniforms: material.defaultUniforms,
		vertexShader: asset.shader['text.vert'],
		fragmentShader: asset.shader['text.frag'],
		side: THREE.DoubleSide
	})

	material.line = new THREE.ShaderMaterial( {
		uniforms: material.defaultUniforms,
		vertexShader: asset.shader['line.vert'],
		fragmentShader: asset.shader['line.frag'],
		side: THREE.DoubleSide
	})

	material.point = new THREE.ShaderMaterial( {
		uniforms: material.defaultUniforms,
		vertexShader: asset.shader['point.vert'],
		fragmentShader: asset.shader['point.frag'],
		side: THREE.DoubleSide
	})

	material.filter = new THREE.ShaderMaterial( {
		uniforms: material.defaultUniforms,
		vertexShader: asset.shader['screen.vert'],
		fragmentShader: asset.shader['filter.frag'],
		side: THREE.DoubleSide
	})
}