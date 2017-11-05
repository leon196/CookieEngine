

import * as THREE from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';
import uniforms from '../engine/uniforms';
import FrameBuffer from '../engine/framebuffer';

export default class {
	constructor() {
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
		this.scene = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.buffer);
		this.buffer = new FrameBuffer();
	}

	update() {
		uniforms.buffer.value = this.buffer.getTexture();
		this.buffer.swap();
		renderer.render(this.scene, this.camera, this.buffer.getTarget(), true);
	}
}
