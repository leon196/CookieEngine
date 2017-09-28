

import * as THREE from 'three.js';
import assets from '../engine/assets';

export default class {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );

		this.geometry = new THREE.PlaneGeometry(1,1,1);
		this.plane = new THREE.Mesh(this.geometry, assets.shaderMaterials.filter);
		this.scene = this.plane;

		assets.shaderMaterials.filter.uniforms.fadeTransition = { value: 0 };
	}

	update() {
	}
}
