
import * as THREE from 'three.js';
import { closestPowerOfTwo, getRandomPoints } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Tree extends THREE.Object3D {

	constructor() {
		super();
		this.uniforms = {
			time: { value: 0 },
		}

		var material = assets.shaders.tree.clone();
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;

		assets.shaders.tree.cloned.push(material);

		assets.geometries.tree.children.forEach(mesh => mesh.material = material );

		this.add(assets.geometries.tree);
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}