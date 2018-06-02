
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Geometry from '../engine/geometry';
import parameters from '../engine/parameters';
import heightmap from './heightmap'

export default class Tree extends THREE.Object3D {

	constructor() {
		super();

		this.treeUniforms = {
			time: { value: 0 },
		}
		var mesh = assets.geometries.tree.clone();
		var material = assets.shaders.tree
		material.side = THREE.FrontSide;
		material.uniforms = this.treeUniforms;
		material.needsUpdate = true;
		mesh.children.forEach(child => child.material = material );
		this.add(mesh);

		// leaves
		this.leavesUniforms = {
			time: { value: 0 },
			visible: { value: 0 },
			bounce: { value: 0 },
			twist: { value: 0 },
		}
		material = assets.shaders.leaves
		material.side = THREE.FrontSide;
		material.uniforms = this.leavesUniforms;
		material.needsUpdate = true;
		var array = assets.geometries.tree.children[0].geometry.attributes.position.array;
		var arrayLOD = [];
		var lod = 10.;
		var count = array.length;
		for (var i = 0; i < count; i += lod * 3)
			for (var x = 0; x < 3; ++x)	arrayLOD.push(array[i+x]);
		var attributes = { position: { array: arrayLOD, itemSize: 3 }}
		var geometries = Geometry.create(attributes);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			this.add(mesh);
		});

		// froot
		this.frootUniforms = {
			time: { value: 0 },
			visible: { value: 0 },
			bounce: { value: 0 },
			heightmap: { value: heightmap.texture },
			heightNormalMap: { value: heightmap.normalMap.texture },
		}
		material = assets.shaders.froot;
		material.side = THREE.FrontSide;
		material.uniforms = this.frootUniforms;
		material.needsUpdate = true;
		array = assets.geometries.tree.children[0].geometry.attributes.position.array;
		arrayLOD = [];
		lod = 50.;
		count = array.length;
		for (var i = 0; i < count; i += lod * 3)
			for (var x = 0; x < 3; ++x)	arrayLOD.push(array[i+x]);
		attributes = { position: { array: arrayLOD, itemSize: 3 }}
		geometries = Geometry.create(attributes);
		geometries.forEach(geo => {
			var mesh = new THREE.Mesh(geo, material);
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.treeUniforms.time.value = elapsed;
		this.leavesUniforms.time.value = elapsed;
		this.frootUniforms.time.value = elapsed;
	}
}