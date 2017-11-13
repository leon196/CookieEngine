
import * as THREE from 'three.js';
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Geometry from '../engine/geometry';
import renderer from '../engine/renderer';
import { OrbitControls } from '../libs/OrbitControls';
import { simpleText } from '../engine/make-text';
import { lerp, clamp } from '../engine/misc';

export default class MainScene {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );

		this.controls = new OrbitControls( this.camera, renderer.domElement );
		this.controls.rotateSpeed = 0.1;
		this.controls.zoomSpeed = 2.5;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = .1;

		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 5;
		this.timePreviousFrame = 0;

		let count = 1000;
		let attributes = {
			position: {
				array: Geometry.getRandomPoints(count),
				itemSize: 3
			}
		};
		Geometry.create(count, attributes, [8,8], assets.shaderMaterials.particle)
			.forEach(mesh => { this.scene.add(mesh); });
	}

	update(elapsed) {
		this.controls.update();
		var dt = clamp(Math.abs(elapsed - this.timePreviousFrame), 0., 1.);
		this.timePreviousFrame = elapsed;
	}
}
