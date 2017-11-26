
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import Particles from '../../engine/particles';
import { arrayVec3Distance } from '../../engine/misc';

export default class LineMesh extends THREE.Scene {
	constructor() {
		super();

		let geometry = assets.geometries.treeCurves.children[0].geometry;
		var nexts = [];
		var positions = geometry.attributes.position.array;
		var count = positions.length / 3;
		for (var i = 0; i+1 < count; ++i) {
			var dist = arrayVec3Distance(positions, i*3, (i+1)*3);
			for (var s = 0; s < 3; ++s) {
				if (dist < .2) {
					nexts.push(positions[(i+1)*3+s]);
				} else {
					nexts.push(positions[i*3+s]);
				}
			}
		}
		geometry.addAttribute('next', new THREE.BufferAttribute(new Float32Array(nexts), 3));
		Particles.createMeshes(geometry.attributes, assets.shaders.lines)
			.forEach(mesh => {
				mesh.position.z = 10.;
				this.add(mesh);
			});
	}
}
