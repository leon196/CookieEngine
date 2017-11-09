

import * as THREE from 'three.js';
import { OrbitControls } from '../libs/OrbitControls';
import renderer from '../engine/renderer'

export default class Scene {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 1000 );
		this.camera.position.y = 2;
		this.camera.position.z = 5;

		this.controls = new OrbitControls( this.camera, renderer.domElement );
		this.controls.rotateSpeed = 0.1;
		this.controls.zoomSpeed = 2.5;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = .1;
	}

	update(elapsed) {
		this.controls.update();
	}

	add(mesh) {
		this.scene.add(mesh);
	}

	addChildren(meshes) {
		for (var i = 0; i < meshes.length; ++i) this.scene.add(meshes[i]);
	}
}
