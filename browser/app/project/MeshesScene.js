
import * as THREE from 'three.js';
import Scene from '../engine/scene';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Particles from '../engine/particles';
import { arrayVec3Distance } from '../engine/misc';

export default class MeshesScene extends Scene {
	constructor() {
		super('MeshesScene');
		this.addCurvedMesh();
		this.addLineMesh();
	}

	addLineMesh() {
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
		Particles.createMeshes(geometry.attributes, assets.shaderMaterials.lineMeshExample)
			.forEach(mesh => {
				mesh.position.z = 10.;
				this.scene.add(mesh);
			});
	}

	addCurvedMesh() {
		let meshes = assets.geometries.jonathan.children;
		for (var c = 0; c < 8; ++c) {
			meshes.forEach(child => {
				var geometry = new THREE.BufferGeometry();
				var geo = child.geometry;
				var numbers = [];
				var attributes = Object.keys(geo.attributes);
				attributes.forEach(name => {
					geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(geo.attributes[name].array), geo.attributes[name].itemSize));
				});
				for (var i = 0; i < geo.attributes.position.array.length / 3; ++i) {
					numbers.push(c);
				}
	      geometry.addAttribute('number', new THREE.BufferAttribute(new Float32Array(numbers), 1));
				var mesh = new THREE.Mesh(geometry, assets.shaderMaterials.curvedMeshExample);
				this.scene.add(mesh);
			});
		}

		uniforms.meshTexture = { value: assets.textures.jonathan };
	}
}
