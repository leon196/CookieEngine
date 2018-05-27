
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Geometry from '../engine/geometry';
import heightmap from './heightmap';
import parameters from '../engine/parameters';

export default class Grass extends THREE.Object3D {

	constructor() {
		super();

		var countResolution = 128.;

		this.uniforms = {
			time: { value: 0 },
			visible: { value: 0 },
			heightmap: { value: heightmap.texture },
			indexResolution: { value: countResolution },
		}

		var material = assets.shaders.grass.clone();
		material.side = THREE.DoubleSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;

		assets.shaders.grass.cloned.push(material);

		var geometries = Geometry.create(Geometry.randomPositionAttribute(countResolution*countResolution), [1,3]);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			mesh.frustumCulled = false;
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.visible.value = parameters.scene.grass;
	}
}