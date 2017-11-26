
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import Scene from '../../engine/scene';
import uniforms from '../../engine/uniforms';

export default class Text extends Scene {

	constructor() {
		super('Text');

		this.sceneFrame.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.text));
		var words = [
			{
				text: 'CooKie',
				font: 'rhinos_rocksregular',
				textAlign: 'center',
				fontSize: 196,
				fillStyle: 'white',
				textAlign: 'center',
				textBaseline: 'middle',
				width: 512,
				height: 512,
				shadowColor: 'rgba(0,0,0,.5)',
				shadowBlur: 4,
				offsetY: -50,
			},
			{
				text: 'Demoparty',
				fontSize: 106,
				offsetY: 100,
			},
		];
		uniforms.textTexture = { value: makeText.createTexture(words) };
	}

	update() {
	}
}
