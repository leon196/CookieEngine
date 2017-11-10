import * as THREE from 'three.js';

export default class {
	constructor(width, height, format, type) {
		this.renderTextures = [];
		this.current = 0;
		this.count = 2;
		width = width || window.innerWidth;
		height = height || window.innerHeight;
		format = format || THREE.RGBAFormat;
		type = type || THREE.UnsignedByteType;

		for (var i = 0; i < this.count; ++i) {
			this.renderTextures.push(new THREE.WebGLRenderTarget(width, height, {
				minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: format, type: type }));
		}
	}

	getTarget() {
		return this.renderTextures[this.current];
	}

	getTexture() {
		return this.renderTextures[this.current].texture;
	}

	swap() {
		this.current = (this.current + 1) % this.count;
	}

	resize(width, height) {
		for (var i = 0; i < this.renderTextures.length; ++i) {
			this.renderTextures[i].setSize(width, height);
		}
	}
}
