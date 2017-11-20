
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import uniforms from '../../engine/uniforms';
import FrameBuffer from '../../engine/FrameBuffer';
import Paricles from '../../engine/particles';

export default class ParticleSystem extends THREE.Scene {

	constructor() {
		super();
		var options;

    let attributes = Paricles.randomPositionAttribute(64*64);
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

		uniforms['fireSpawnTexture'] = {
			value: Paricles.createDataTexture(attributes.position.array, attributes.position.itemSize)
		};
	}

	update() {
		this.velocityBuffer.update();
		this.positionBuffer.update();
	}
}
