import * as THREE from 'three.js';

export default class {
	constructor(width, height, format, type, count) {
		this.renderTextures = [];
		this.current = 0;
		this.count = count || 1;
		this.timePreviousFrame = 0;
		this.timeLagStart = 0;
		this.timeLagDelay = 1;
		this.levelOfDetail = 1;
		width = width || window.innerWidth;
		height = height || window.innerHeight;
		format = format || THREE.RGBAFormat;
		type = type || THREE.UnsignedByteType;
		for (var i = 0; i < this.count; ++i) {
			this.renderTextures.push(new THREE.WebGLRenderTarget(width/this.levelOfDetail, height/this.levelOfDetail, {
				minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: format, type: type }));
		}
	}

	getRenderTarget() {
		return this.renderTextures[this.current];
	}

	getTexture() {
		return this.renderTextures[this.current].texture;
	}

	swap() {
		this.current = (this.current + 1) % this.count;
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
					this.renderTextures[i].resize(window.innerWidth/this.levelOfDetail, window.innerHeight/this.levelOfDetail);
				}
			}
		} else if (fps > 60. && this.levelOfDetail > 1) {
			if (this.timeLagStart > time) {
				this.timeLagStart = time;
			}
			if (clamp((time-this.timeLagStart)/this.timeLagDelay, 0., 1.) >= 1.) {
				this.levelOfDetail /= 2.;
				this.timeLagStart += time + 10.;
				for (var i = 0; i < this.count; ++i) {
					this.renderTextures[i].resize(window.innerWidth/this.levelOfDetail,window.innerHeight/this.levelOfDetail);
				}
			}
		} else {
			this.timeLagStart = time + 10.;
		}
		this.timePreviousFrame = time;
	}
}
