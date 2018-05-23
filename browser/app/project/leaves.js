
import * as THREE from 'three.js';
import { closestPowerOfTwo, getRandomPoints } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Leaves extends THREE.Object3D {

	constructor() {
		super();
		this.uniforms = {
			time: { value: 0 },
		}

		var material = assets.shaders.leaves.clone();
		material.side = THREE.DoubleSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;

		assets.shaders.leaves.cloned.push(material);

		var attributes = {
			position: {
				array: assets.geometries.tree.children[0].geometry.attributes.position.array,
				itemSize: 3,
			}
		}
		var geometries = Geometry.create(attributes);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}