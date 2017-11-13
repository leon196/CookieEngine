
import * as THREE from 'three.js';
import renderer from './renderer'
import { OrbitControls } from '../libs/OrbitControls';

export default class Scene {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
		this.camera.position.y = 1;
		this.camera.position.x = -20;

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
