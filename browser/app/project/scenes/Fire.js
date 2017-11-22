
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import uniforms from '../../engine/uniforms';
import FrameBuffer from '../../engine/FrameBuffer';
import Paricles from '../../engine/particles';
import { decimateAttributes } from '../../engine/misc';

export default class Fire extends THREE.Scene {

	constructor() {
		super();

		var cookieGeometry = assets.geometries.cookie.children[0].geometry;
		// this.add(new THREE.Mesh(cookieGeometry, assets.shaderMaterials.cookie));
		uniforms.cookieTexture = { value: assets.textures.cookie };

		// text
		// this.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.text));
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


		// particle system
		var options;
		// let attributes = Paricles.randomPositionAttribute(256*256);
		var titleGeometry = assets.geometries.title.children[0].geometry;
		this.add(new THREE.Mesh(titleGeometry, assets.shaderMaterials.simple));
		let attributes = decimateAttributes(titleGeometry.attributes, 1);
		Paricles.createMeshes(attributes, assets.shaderMaterials.fire)
			.forEach(mesh => { this.add(mesh); });

		options = FrameBuffer.optionsForFloatBuffer();
		options.uniformName = 'fireVelocityTexture';
		options.material = assets.shaderMaterials.fireVelocity;
		this.velocityBuffer = new FrameBuffer(options);

		options = FrameBuffer.optionsForFloatBuffer();
		options.uniformName = 'firePositionTexture';
		options.material = assets.shaderMaterials.firePosition;
		this.positionBuffer = new FrameBuffer(options);

		// console.log(attributes.position.array);
		uniforms['fireSpawnTexture'] = {
			value: Paricles.createDataTexture(attributes.position.array, attributes.position.itemSize)
		};
	}

	update() {
		this.velocityBuffer.update();
		this.positionBuffer.update();
	}
}
