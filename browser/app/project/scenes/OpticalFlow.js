
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import FrameBuffer from '../../engine/FrameBuffer';
import Particles from '../../engine/particles';
import uniforms from '../../engine/uniforms';
import camera from '../../engine/camera';

export default class OpticalFlow extends THREE.Scene {

	constructor() {
		super();

		this.frame = new FrameBuffer(2, window.innerWidth, window.innerHeight,
			THREE.RGBAFormat, THREE.FloatType,
			THREE.LinearFilter, THREE.LinearFilter,
			false, false);
		this.scenePass = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.opticalFlow);
		this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.z = -1;
		uniforms.opticalFlowTexture = { value: this.frame.getTexture() };

		let attributes = Particles.randomPositionAttribute(256*256);
		Particles.createMeshes(attributes, assets.shaderMaterials.gridArrow)
			.forEach(mesh => { this.add(mesh); });
	}

	update() {
		uniforms.opticalFlowTexture.value = this.frame.getTexture();
		this.frame.swap();
		renderer.render(this.scenePass, this.camera, this.frame.getRenderTarget(), true);
	}

	setSize(w,h) {
		this.frame.setSize(w,h);
	}
}
