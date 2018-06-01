
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
			bounce: { value: 0 },
			twist: { value: 0 },
			stormIntensity: { value: 0 },
			stormDirection: { value: [0,-1,0] },
			heightmap: { value: heightmap.texture },
			heightNormalMap: { value: heightmap.normalMap.texture },
			indexResolution: { value: countResolution },
		}

		var material = assets.shaders.rain;
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;

		var geometries = Geometry.create(Geometry.randomPositionAttribute(countResolution*countResolution));
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			mesh.frustumCulled = false;
			this.add(mesh);
		});

		// droplets
		material = assets.shaders.droplet;
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;

		var arrayPos = assets.geometries.tree.children[0].geometry.attributes.position.array;
		var arrayNormal = assets.geometries.tree.children[0].geometry.attributes.normal.array;
		var arrayPosLOD = [];
		var arrayNormalLOD = [];
		var lod = 20.;
		var count = arrayPos.length;
		for (var i = 0; i < count; i += lod * 3) {
			for (var x = 0; x < 3; ++x)	arrayPosLOD.push(arrayPos[i+x]);
			for (var x = 0; x < 3; ++x)	arrayNormalLOD.push(arrayNormal[i+x]);
		}
		var attributes = {
			position: { array: arrayPosLOD, itemSize: 3 },
			normal: { array: arrayNormalLOD, itemSize: 3 },
		};
		geometries = Geometry.create(attributes);
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