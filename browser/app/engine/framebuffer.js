import * as THREE from 'three.js';
import { closestPowerOfTwo } from '../engine/misc';
import renderer from './renderer';

export default class {
	constructor(options) {
		options = options || {};
		this.renderTextures = [];
		this.currentIndex = 0;
		this.count = options.count || 2;
		for (var i = 0; i < this.count; ++i) {
			this.renderTextures.push(new THREE.WebGLRenderTarget(
				options.width || window.innerWidth,
				options.height || window.innerHeight, {
					format: options.format || THREE.RGBAFormat,
					type: options.type || THREE.FloatType,
					minFilter: options.min || THREE.LinearFilter,
					magFilter: options.mag || THREE.LinearFilter,
					stencilBuffer: options.stencil || true,
					depthBuffer: options.depth || true
				}));
		}

		this.scene = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), options.material);
		this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 100);
		this.camera.position.z = 5;
	}

	update () {
		this.swap();
		renderer.render(this.scene, this.camera, this.getRenderTarget(), true);
	}

	record (scene, camera) {
		renderer.render(scene, camera, this.getRenderTarget(), true);
	}

	getRenderTarget () {
		return this.renderTextures[this.currentIndex];
	}

	getTexture () {
		return this.renderTextures[this.currentIndex].texture;
	}

	swap () {
		this.currentIndex = (this.currentIndex + 1) % this.count;
	}

	setSize (width, height) {
		for (var i = 0; i < this.count; ++i) {
			this.renderTextures[i].setSize(width, height);
		}
	}

	dispose () {
		for (var i = 0; i < this.count; ++i) {
			this.renderTextures[i].dispose();
		}
	}

	static createDataTexture(dataArray, itemSize)	{
		var dimension = closestPowerOfTwo(Math.sqrt(dataArray.length / itemSize));
		var array = [];
		var count = dimension * dimension;
		for (var t = 0; t < count; ++t) {
			if (t*itemSize+itemSize-1 < dataArray.length) {
				for (var i = 0; i < 3; ++i) {
					if (i < itemSize) {
						array.push(dataArray[t*itemSize+i]);
					} else {
						array.push(0);
					}
				}
			} else {
				array.push(0,0,0);
			}
		}
		var texture = new THREE.DataTexture(new Float32Array(array), dimension, dimension, THREE.RGBFormat, THREE.FloatType);
		texture.needsUpdate = true;
		return texture;
	}
}
