
import * as THREE from 'three.js';
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Particles from '../engine/particles';
import renderer from '../engine/renderer';
import { OrbitControls } from '../libs/OrbitControls';
import { simpleText } from '../engine/make-text';
import { lerp, clamp, getRandomPoints } from '../engine/misc';

export default class ExampleScene {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 1000 );
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 50;
		this.timePreviousFrame = 0;

		this.controls = new OrbitControls( this.camera, renderer.domElement );
		this.controls.rotateSpeed = 0.1;
		this.controls.zoomSpeed = 2.5;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = .1;

		// assets.textures.spritesheet.wrapS = THREE.RepeatWrapping;
		// assets.textures.spritesheet.wrapT = THREE.RepeatWrapping;
		// uniforms.spritesheet = { value: assets.textures.spritesheet };
		// var image = assets.textures.spritesheet.image;
		// uniforms.spritesheetFrame = { value: [image.width, image.height] };
		// this.add(1000, assets.shaderMaterials.spritesheetExample);

		this.add(3, assets.shaderMaterials.ribbonExample, [1,100]);

		this.add(1000, assets.shaderMaterials.snowExample, [1,1]);
	}

	update(elapsed) {
		this.controls.update();
		var dt = clamp(Math.abs(elapsed - this.timePreviousFrame), 0., 1.);
		this.timePreviousFrame = elapsed;
	}

	add(count, shader, slice) {
		slice = slice || [1,1];
		let attributes = {
			position: {
				array: getRandomPoints(count),
				itemSize: 3
			}
		};
		var particles = new Particles(count, attributes, slice, shader);
		particles.meshes.forEach(mesh => { this.scene.add(mesh); });
	}
}
