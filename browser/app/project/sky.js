
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Geometry from '../engine/geometry';

export default class Sky extends THREE.Object3D {

	constructor() {
		super();

		this.uniforms = {
			time: { value: 0 },
		}

		var material = assets.shaders.sky;
		material.side = THREE.BackSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		var mesh = new THREE.Mesh(new THREE.SphereGeometry(100,10,10), material);
		mesh.frustumCulled = false;
		this.add(mesh);

		// moon
		material = assets.shaders.moon;
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		this.meshMoon = new THREE.Mesh(new THREE.SphereGeometry(5,30,30), material);
		this.meshMoon.frustumCulled = false;
		this.add(this.meshMoon);

		// sun
		material = assets.shaders.sun;
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		this.meshSun = new THREE.Mesh(new THREE.SphereGeometry(10,30,30), material);
		this.meshSun.frustumCulled = false;
		this.add(this.meshSun);
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}