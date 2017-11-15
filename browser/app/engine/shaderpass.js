import * as THREE from 'three.js';
import FrameBuffer from './framebuffer';
import renderer from './renderer';
import uniforms from './uniforms';

export default class {
	constructor(material, uniformName, count, width, height, format, type, mig, mag) {
		this.frame = new FrameBuffer(count, width, height, format, type, mig, mag);
		this.scene = new THREE.Scene();
		this.geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		this.camera = new THREE.Camera();
		this.camera.position.z = 1;
		this.uniformName = uniformName;
		uniforms[uniformName] = { value: 0 };
		if (material !== undefined) {
			this.material = material;
			this.scene.add(new THREE.Mesh(this.geometry, this.material));
		}
	}

	update() {
		uniforms[this.uniformName].value = this.frame.getTexture();
		this.frame.swap();
		renderer.render(this.scene, this.camera, this.frame.getRenderTarget(), true);
	}

	getTexture() {
		return this.frame.getTexture();
	}

	render(scene, camera) {
		renderer.render(scene, camera, this.frame.getRenderTarget(), true);
		uniforms[this.uniformName].value = this.frame.getTexture();
	}

	resize(width, height) {
		this.frame.resize(width, height);
	}
}
