
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

		this.addSprites();
		this.addRainbowRibbons();
		this.addSnow();
		this.addPointCloud();
		this.addCurvedMesh();
	}

	update(elapsed) {
		this.controls.update();
		var dt = clamp(Math.abs(elapsed - this.timePreviousFrame), 0., 1.);
		this.timePreviousFrame = elapsed;
	}

	addSprites() {
			let attributes = Particles.randomPositionAttribute(32);
			Particles.createMeshes(attributes, assets.shaderMaterials.spritesheetExample)
				.forEach(mesh => { this.scene.add(mesh); });

			// spritesheet texture
			assets.textures.spritesheet.wrapS = THREE.RepeatWrapping;
			assets.textures.spritesheet.wrapT = THREE.RepeatWrapping;
			uniforms.spritesheet = { value: assets.textures.spritesheet };
			var image = assets.textures.spritesheet.image;
			uniforms.spritesheetFrame = { value: [image.width, image.height] };
	}

	addRainbowRibbons() {
		let attributes = Particles.randomPositionAttribute(200);
		Particles.createMeshes(attributes, assets.shaderMaterials.ribbonExample, [1,100])
			.forEach(mesh => { this.scene.add(mesh); });
	}

	addSnow() {
		let attributes = Particles.randomPositionAttribute(1000);
		Particles.createMeshes(attributes, assets.shaderMaterials.snowExample)
			.forEach(mesh => { this.scene.add(mesh); });
	}

	addPointCloud() {
		let attributes = assets.geometries.plantPoints.attributes;
		Particles.createMeshes(attributes, assets.shaderMaterials.pointCloudExample)
			.forEach(mesh => { this.scene.add(mesh); });
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

		// mesh texture
		uniforms.meshTexture = { value: assets.textures.jonathan };
	}
}
