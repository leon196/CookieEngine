

import * as THREE from 'three.js';

export default class {
	constructor(shader) {
		this.scene = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), shader);
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	}

	update() {
	}
}
