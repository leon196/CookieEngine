
import * as THREE from 'three.js';
import { closestPowerOfTwo, getRandomPoints } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';
import heightmap from './heightmap';

export default class Ground extends THREE.Object3D {

	constructor() {
		super();

		var noiseTexture = assets.textures.noise1;
		noiseTexture.wrapS = THREE.MirroredRepeatWrapping;
		noiseTexture.wrapT = THREE.MirroredRepeatWrapping;
		noiseTexture.needsUpdate = true;

		this.uniforms = {
			time: { value: 0 },
			noiseMap: { value: noiseTexture },
			heightmap: { value: heightmap.texture },
		}

		var material = assets.shaders.ground.clone();
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		material.extensions.shaderTextureLOD = true;
		assets.shaders.ground.cloned.push(material);

		var mesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100,300,300), material);
		mesh.rotateX(-Math.PI/2.);
		this.add(mesh);
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}