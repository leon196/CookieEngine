
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import uniforms from '../../engine/uniforms';

export default class CurvedMesh extends THREE.Scene {
	constructor() {
		super();

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
				var mesh = new THREE.Mesh(geometry, assets.shaders.curvedMesh);
				this.add(mesh);
			});
		}

		uniforms.meshTexture = { value: assets.textures.jonathan };
	}
}
