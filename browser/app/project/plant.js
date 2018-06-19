
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Geometry from '../engine/geometry';

export default class Plant extends THREE.Object3D {

	constructor() {
		super();

		this.uniforms = {
			time: { value: 0 },
		}
		var material = assets.shaders.plant;
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		var geometries = Geometry.create(Geometry.randomPositionAttribute(10), [5,10]);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}