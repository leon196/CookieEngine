
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import FrameBuffer from '../../engine/FrameBuffer';
import Particles from '../../engine/particles';

export default class OpticalFlow extends THREE.Scene {

	constructor() {
		super();

		this.frame = new FrameBuffer({
			count: 2,
			uniformName: 'opticalFlowTexture',
			material: assets.shaderMaterials.opticalFlow,
			width: window.innerWidth,
			height: window.innerHeight,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			min: THREE.LinearFilter,
			mag: THREE.LinearFilter,
			depth: false,
			stencil: false,
		});

		let attributes = Particles.randomPositionAttribute(256*256);
		Particles.createMeshes(attributes, assets.shaderMaterials.gridArrow)
			.forEach(mesh => { this.add(mesh); });
	}

	update() {
		this.frame.update();
	}

	setSize(w,h) {
		this.frame.setSize(w,h);
	}
}
