
import * as THREE from 'three.js';
import { closestPowerOfTwo, getRandomPoints } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';
import heightmap from './heightmap';

export default class Grass extends THREE.Object3D {

	constructor() {
		super();
		this.uniforms = {
			time: { value: 0 },
			heightmap: { value: heightmap.texture },
		}

		var material = assets.shaders.grass.clone();
		material.side = THREE.DoubleSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;

		assets.shaders.grass.cloned.push(material);

		var geometries = Geometry.create(Geometry.randomPositionAttribute(128*128), [1,4]);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}