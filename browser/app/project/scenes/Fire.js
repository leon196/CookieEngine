
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import Scene from '../../engine/scene';
import camera from '../../engine/camera';
import uniforms from '../../engine/uniforms';
import FrameBuffer from '../../engine/FrameBuffer';
import Paricles from '../../engine/particles';
import { decimateAttributes } from '../../engine/misc';

export default class Fire extends Scene {

	constructor() {
		super('fireSceneTexture');
		var options;

		var geometry = assets.geometries.paper.children[0].geometry;
		this.add(new THREE.Mesh(geometry, assets.shaders.paperSimple));
		
		uniforms.bloodTexture = { value: assets.textures.blood };

		// particle system
		let attributes = decimateAttributes(geometry.attributes, 1);
		Paricles.createMeshes(attributes, assets.shaders.fire)
			.forEach(mesh => { this.add(mesh); });

		options = FrameBuffer.optionsForFloatBuffer();
		options.uniformName = 'fireVelocityTexture';
		options.material = assets.shaders.fireVelocity;
		this.velocityBuffer = new FrameBuffer(options);

		options = FrameBuffer.optionsForFloatBuffer();
		options.uniformName = 'firePositionTexture';
		options.material = assets.shaders.firePosition;
		this.positionBuffer = new FrameBuffer(options);

		uniforms['fireSpawnTexture'] = {
			value: Paricles.createDataTexture(attributes.position.array, attributes.position.itemSize)
		};
	}

	update(time) {
		super.update(time);
		this.velocityBuffer.update();
		this.positionBuffer.update();
	}
}
