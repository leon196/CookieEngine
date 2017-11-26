import * as THREE from 'three.js';
import renderer from './renderer';
import uniforms from './uniforms';
import camera from './camera';

export default class {
	constructor(options) {
		options = options || {};
		this.renderTextures = [];
		this.currentIndex = 0;
		this.count = options.count || 1;
		this.timePreviousFrame = 0;
		this.timeLagStart = 0;
		this.timeLagDelay = 1;
		this.levelOfDetail = 1;
		for (var i = 0; i < this.count; ++i) {
			this.renderTextures.push(new THREE.WebGLRenderTarget(
				(options.width || window.innerWidth)/this.levelOfDetail,
				(options.height || window.innerHeight)/this.levelOfDetail, {
				format: options.format || THREE.RGBAFormat,
				type: options.type || THREE.UnsignedByteType,
				minFilter: options.min || THREE.LinearFilter,
				magFilter: options.mag || THREE.LinearFilter,
				stencilBuffer: options.stencil || true,
				depthBuffer: options.depth || true
			}));
		}
		if (options.uniformName != undefined && options.material != undefined) {
			this.scene = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), options.material);
			this.scene.frustumCulled = false;
			this.uniformName = options.uniformName;
			uniforms[this.uniformName] = { value: 0 };
		}
	}

	update() {
		if (this.scene != undefined) {
			uniforms[this.uniformName].value = this.getTexture();
			this.swap();
			renderer.render(this.scene, camera.ortho, this.getRenderTarget(), true);
		}
	}

	getRenderTarget() {
		return this.renderTextures[this.currentIndex];
	}

	getTexture() {
		return this.renderTextures[this.currentIndex].texture;
	}

	swap() {
		this.currentIndex = (this.currentIndex + 1) % this.count;
	}

	setSize(width, height) {
		for (var i = 0; i < this.count; ++i) {
			this.renderTextures[i].setSize(width, height);
		}
	}

	static optionsForFloatBuffer() {
		return {
			count: 2,
			type: THREE.FloatType,
			min: THREE.NearestFilter,
			mag: THREE.NearestFilter,
			depth: false,
			stencil: false,
		}
	}

	autoResizeFromFPS (time) {
		var fps = 1. / (time - this.timePreviousFrame);
		if (fps < 30. && this.levelOfDetail < 8) {
			if (this.timeLagStart > time) {
				this.timeLagStart = time;
			}
			if (clamp((time-this.timeLagStart)/this.timeLagDelay, 0., 1.) >= 1.) {
				this.levelOfDetail *= 2.;
				this.timeLagStart += time + 10.;
				for (var i = 0; i < this.count; ++i) {
					this.setSize(window.innerWidth/this.levelOfDetail,window.innerHeight/this.levelOfDetail);
				}
			}
		} else if (fps > 60. && this.levelOfDetail > 1) {
			if (this.timeLagStart > time) {
				this.timeLagStart = time;
			}
			if (clamp((time-this.timeLagStart)/this.timeLagDelay, 0., 1.) >= 1.) {
				this.levelOfDetail /= 2.;
				this.timeLagStart += time + 10.;
				this.setSize(window.innerWidth/this.levelOfDetail,window.innerHeight/this.levelOfDetail);
			}
		} else {
			this.timeLagStart = time + 10.;
		}
		this.timePreviousFrame = time;
	}
}
