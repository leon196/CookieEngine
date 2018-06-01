
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Geometry from '../engine/geometry';
import heightmap from './heightmap';

export default class Ground extends THREE.Object3D {

	constructor() {
		super();

		this.uniforms = {
			time: { value: 0 },
			heightmap: { value: heightmap.texture },
			heightNormalMap: { value: heightmap.normalMap.texture },
		}

		var material = assets.shaders.ground;
		material.side = THREE.FrontSide;
		material.uniforms = this.uniforms;
		material.needsUpdate = true;
		material.extensions.shaderTextureLOD = true;

		var mesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100,300,300), material);
		mesh.rotateX(-Math.PI/2.);
		this.add(mesh);
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
	}
}