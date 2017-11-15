
import * as THREE from 'three.js';
import Scene from '../engine/scene';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Particles from '../engine/particles';
import ShaderPass from '../engine/shaderpass';

export default class GridScreenScene extends Scene {
	constructor() {
		super('GridScreenScene');

		this.opticalFramePass = new ShaderPass(assets.shaderMaterials.opticalFrameExample, 'opticalFrame', 3);
		uniforms.newFrame = { value: 0 };
		uniforms.lastFrame = { value: 0 };

		this.passes = [
			new ShaderPass(assets.shaderMaterials.opticalFlowExample, 'opticalFlow', 2,
				window.innerWidth, window.innerHeight,
				THREE.RGBAFormat, THREE.FloatType,
				THREE.LinearFilter, THREE.LinearFilter
			),
			this.opticalFramePass,
		];

		let attributes = Particles.randomPositionAttribute(256*256);
		Particles.createMeshes(attributes, assets.shaderMaterials.gridScreenExample)
			.forEach(mesh => { this.scene.add(mesh); });
	}

	update(time) {
		super.update(time);

		uniforms.newFrame.value = this.opticalFramePass.getTexture();
		this.opticalFramePass.update(time);
		uniforms.lastFrame.value = this.opticalFramePass.getTexture();
		this.passes.forEach(pass => pass.update(time));
	}

	resize(width, height) {
		super.resize(width, height);
		this.passes.forEach(pass => pass.resize(width, height));
	}
}
