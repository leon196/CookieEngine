
import * as THREE from 'three.js';
import { closestPowerOfTwo, getRandomPoints } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Sky extends THREE.Object3D {

	constructor() {
		super();

		var noiseTexture = assets.textures.noise1;
		noiseTexture.wrapS = THREE.MirroredRepeatWrapping;
		noiseTexture.wrapT = THREE.MirroredRepeatWrapping;
		noiseTexture.needsUpdate = true;

		this.uniforms = {
			time: { value: 0 },
			noiseMap: { value: noiseTexture },
		}

		var material = assets.shaders.sky.clone();
		material.side = THREE.BackSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		assets.shaders.sky.cloned.push(material);

		var mesh = new THREE.Mesh(new THREE.SphereGeometry(100,100,100), material);
		this.add(mesh);
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}