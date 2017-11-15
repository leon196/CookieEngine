import * as THREE from 'three.js';
import FrameBuffer from './framebuffer';
import renderer from './renderer';
import uniforms from './uniforms';

export default class {
	constructor(material, uniformName, count, width, height, format, type, mig, mag) {
		this.frameBuffer = new FrameBuffer(count, width, height, format, type, mig, mag);
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
		uniforms[this.uniformName].value = this.frameBuffer.getTexture();
		this.frameBuffer.swap();
		renderer.render(this.scene, this.camera, this.frameBuffer.getRenderTarget(), true);
	}

	getTexture() {
		return this.frameBuffer.getTexture();
	}

	render(scene, camera) {
		renderer.render(scene, camera, this.frameBuffer.getRenderTarget(), true);
		uniforms[this.uniformName].value = this.frameBuffer.getTexture();
	}

	resize(width, height) {
		
	}
}
