
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
		material.linecap = "round";
		material.linejoin = "round";
		material.linewidth = 1;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;

		assets.shaders.leaves.cloned.push(material);

		var array = assets.geometries.tree.children[0].geometry.attributes.position.array;
		var arrayLOD = [];
		var lod = 10.;
		var count = array.length;
		for (var i = 0; i < count; i += lod * 3) {
			for (var x = 0; x < 3; ++x)	arrayLOD.push(array[i+x]);
		} 
		var attributes = {
			position: {
				array: arrayLOD,
				itemSize: 3,
			}
		}
		var geometries = Geometry.create(attributes);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			// var mesh = new THREE.LineSegments(geo, material);
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}