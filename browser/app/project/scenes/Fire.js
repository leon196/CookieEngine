
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import camera from '../../engine/camera';
import uniforms from '../../engine/uniforms';
import FrameBuffer from '../../engine/FrameBuffer';
import Paricles from '../../engine/particles';
import { decimateAttributes } from '../../engine/misc';

export default class Fire extends THREE.Scene {

	constructor() {
		super();
		var options;

		this.sceneFrame = new THREE.Scene();

		this.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.sceneFire));

		options = {
			count: 2,
			type: THREE.FloatType,
		}
		this.frame = new FrameBuffer(options);
		uniforms.fireSceneTexture = { value: 0 };

		var geometry = assets.geometries.cookie.children[0].geometry;
		this.sceneFrame.add(new THREE.Mesh(geometry, assets.shaderMaterials.cookie));
		uniforms.cookieTexture = { value: assets.textures.cookie };

		// text
		// this.sceneFrame.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.text));
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
		let attributes = decimateAttributes(geometry.attributes, 1);
		Paricles.createMeshes(attributes, assets.shaderMaterials.fire)
			.forEach(mesh => { this.sceneFrame.add(mesh); });

		options = FrameBuffer.optionsForFloatBuffer();
		options.uniformName = 'fireVelocityTexture';
		options.material = assets.shaderMaterials.fireVelocity;
		this.velocityBuffer = new FrameBuffer(options);

		options = FrameBuffer.optionsForFloatBuffer();
		options.uniformName = 'firePositionTexture';
		options.material = assets.shaderMaterials.firePosition;
		this.positionBuffer = new FrameBuffer(options);

		uniforms['fireSpawnTexture'] = {
			value: Paricles.createDataTexture(attributes.position.array, attributes.position.itemSize)
		};
	}

	update() {
		this.velocityBuffer.update();
		this.positionBuffer.update();

		uniforms.fireSceneTexture.value = this.frame.getTexture();
		this.frame.swap();
		renderer.render(this.sceneFrame, camera, this.frame.getRenderTarget(), true);
	}
}
