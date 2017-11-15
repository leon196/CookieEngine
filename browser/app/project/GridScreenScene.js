
import * as THREE from 'three.js';
import Scene from '../engine/scene';
import assets from '../engine/assets';
import Particles from '../engine/particles';
import ShaderPass from '../engine/shaderpass';

export default class GridScreenScene extends Scene {
	constructor() {
		super('GridScreenScene');

		this.opticalFlowPass = new ShaderPass(assets.shaderMaterials.opticalFlowExample, 'opticalFlow', 2);

		let attributes = Particles.randomPositionAttribute(256*256);
		Particles.createMeshes(attributes, assets.shaderMaterials.gridScreenExample)
			.forEach(mesh => { this.scene.add(mesh); });
	}

  update(time) {
		super.update(time);
    this.opticalFlowPass.update();
  }
}
