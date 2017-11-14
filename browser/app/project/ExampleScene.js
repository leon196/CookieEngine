
import * as THREE from 'three.js';
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Particles from '../engine/particles';
import renderer from '../engine/renderer';
import { OrbitControls } from '../libs/OrbitControls';
import { simpleText } from '../engine/make-text';
import { lerp, clamp } from '../engine/misc';

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

		let attributes;

		// sprites
		attributes = Particles.randomPositionAttribute(32);
		Particles.createMeshes(attributes, assets.shaderMaterials.spritesheetExample)
			.forEach(mesh => { this.scene.add(mesh); });

		// spritesheet texture
		assets.textures.spritesheet.wrapS = THREE.RepeatWrapping;
		assets.textures.spritesheet.wrapT = THREE.RepeatWrapping;
		uniforms.spritesheet = { value: assets.textures.spritesheet };
		var image = assets.textures.spritesheet.image;
		uniforms.spritesheetFrame = { value: [image.width, image.height] };

		// rainbow ribbons
		attributes = Particles.randomPositionAttribute(100);
		Particles.createMeshes(attributes, assets.shaderMaterials.ribbonExample, [1,100])
			.forEach(mesh => { this.scene.add(mesh); });

		// snow
		attributes = Particles.randomPositionAttribute(1000);
		Particles.createMeshes(attributes, assets.shaderMaterials.snowExample)
			.forEach(mesh => { this.scene.add(mesh); });

		// point cloud
		attributes = assets.geometries.plantPoints.attributes;
		Particles.createMeshes(attributes, assets.shaderMaterials.pointCloudExample)
			.forEach(mesh => { this.scene.add(mesh); });
	}

	update(elapsed) {
		this.controls.update();
		var dt = clamp(Math.abs(elapsed - this.timePreviousFrame), 0., 1.);
		this.timePreviousFrame = elapsed;
	}
}
