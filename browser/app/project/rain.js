
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Geometry from '../engine/geometry';
import parameters from '../engine/parameters';
import heightmap from './heightmap';

export default class Rain extends THREE.Object3D {

	constructor() {
		super();

		var countResolution = 64.;

		this.uniforms = {
			time: { value: 0 },
			visible: { value: 0 },
			heightmap: { value: heightmap.texture },
			heightNormalMap: { value: heightmap.normalMap.texture },
			indexResolution: { value: countResolution },
		}

		var material = assets.shaders.rain.clone();
		material.side = THREE.DoubleSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		assets.shaders.rain.cloned.push(material);

		var geometries = Geometry.create(Geometry.randomPositionAttribute(countResolution*countResolution));
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			mesh.frustumCulled = false;
			this.add(mesh);
		});

		// droplets
		material = assets.shaders.droplet.clone();
		material.side = THREE.DoubleSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		assets.shaders.droplet.cloned.push(material);

		var array = assets.geometries.tree.children[0].geometry.attributes.position.array;
		var arrayLOD = [];
		var lod = 30.;
		var count = array.length;
		for (var i = 0; i < count; i += lod * 3)
			for (var x = 0; x < 3; ++x)	arrayLOD.push(array[i+x]);
		var attributes = { position: { array: arrayLOD, itemSize: 3 } };
		geometries = Geometry.create(attributes);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			mesh.frustumCulled = false;
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.visible.value = parameters.scene.rain;
	}
}