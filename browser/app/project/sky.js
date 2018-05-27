
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Geometry from '../engine/geometry';

export default class Sky extends THREE.Object3D {

	constructor() {
		super();

		this.uniforms = {
			time: { value: 0 },
		}

		var material = assets.shaders.sky.clone();
		material.side = THREE.BackSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		assets.shaders.sky.cloned.push(material);
		var mesh = new THREE.Mesh(new THREE.SphereGeometry(100,10,10), material);
		this.add(mesh);

		// moon
		material = assets.shaders.moon.clone();
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		assets.shaders.moon.cloned.push(material);
		this.meshMoon = new THREE.Mesh(new THREE.SphereGeometry(10,30,30), material);
		this.meshMoon.frustumCulled = false;
		this.add(this.meshMoon);

		// sun
		material = assets.shaders.sun.clone();
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		assets.shaders.sun.cloned.push(material);
		this.meshSun = new THREE.Mesh(new THREE.SphereGeometry(10,30,30), material);
		this.meshSun.frustumCulled = false;
		this.add(this.meshSun);

		// stars
		var countResolution = 32;
		this.uniforms.indexResolution = { value: countResolution };
		material = assets.shaders.star.clone();
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		assets.shaders.star.cloned.push(material);
		var geometries = Geometry.create(Geometry.randomPositionAttribute(countResolution*countResolution));
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			mesh.frustumCulled = false;
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}