

import * as THREE from 'three.js';
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import Particle from '../engine/particle';
import Line from '../engine/line';
import Point from '../engine/point';
import renderer from '../engine/renderer';
import State from '../engine/state';
import { simpleText } from '../engine/makeText';
import uniforms from '../engine/uniforms';
import Geometry from '../engine/geometry';
import message from '../../asset/message';
import { OrbitControls } from '../libs/OrbitControls';
import { lerp, clamp } from '../libs/misc';

export default class {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
		this.camera.position.y = 10;
		this.camera.position.z = 20;
		this.lookAt = new THREE.Vector3();
		this.lastElapsed = 0;

		this.controls = new OrbitControls( this.camera, renderer.domElement );
		this.controls.rotateSpeed = 0.5;

		uniforms.jonathanTexture = { value: assets.materials.Jonathan2.map };
		// uniforms.jonathanTexture = { value: assets.materials.Mario.map };
		// uniforms.jonathanTexture = { value: assets.materials.Chouchen.map };

		var geometry = assets.geometries.Jonathan1k.children[0].geometry;
		this.generate(80, geometry, assets.shaderMaterials.flying);

		geometry = assets.geometries.Jonathan10k.children[0].geometry;
		this.generate(1, geometry, assets.shaderMaterials.head);

		geometry =  assets.geometries.question.children[0].geometry;
		this.generate(8*8, geometry, assets.shaderMaterials.symbol);

		uniforms.ribbonText = { value: this.generateText('A', 'bebas', 72, 64, 64, true) };
		uniforms.titleText = { value: this.generateText('TITLE', 'bebas', 72, 512, 64, true) };
		uniforms.creditText = { value: this.generateText('koltes   ponk   zac', 'bebas', 72, 512, 64, true) };

		Geometry.createRibbons(1, 128, assets.shaderMaterials.ribbonScreen)
			.forEach(mesh => this.scene.add(mesh));

		Geometry.createRibbons(5, 128, assets.shaderMaterials.ribbon)
			.forEach(mesh => this.scene.add(mesh));
	}

	generateText(message, font, fontSize, width, height, center) {
		var text = new THREE.Texture(simpleText(message, font, fontSize, width, height, center));
		text.wrapS = THREE.RepeatWrapping;
		text.needsUpdate = true;
		return text;
	}

	generate(count, geo, shader) {
		var min = -1000;
		var max = 1000;
		geo.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));
		geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), max);
		for (var c = 0; c < count; ++c) {
			var geometry = new THREE.BufferGeometry()
			var numbers = [];
			var attributes = Object.keys(geo.attributes);
			attributes.forEach(name => {
				geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(geo.attributes[name].array), geo.attributes[name].itemSize));
			});
			for (var i = 0; i < geo.attributes.position.array.length / 3; ++i) {
				numbers.push(c);
			}
			geometry.addAttribute( 'number', new THREE.BufferAttribute( new Uint16Array(numbers), 1 ) );
			var mesh = new THREE.Mesh(geometry, shader);
			this.scene.add(mesh);
		}
	}

	update(elapsed) {
		var dt = clamp(Math.abs(elapsed - this.lastElapsed), 0., 1.);
		var cameraPos = assets.animations.getPosition('camera', elapsed);
		this.camera.position.x = lerp(this.camera.position.x, -cameraPos[0], dt);
		this.camera.position.y = lerp(this.camera.position.y, cameraPos[2], dt);
		this.camera.position.z = lerp(this.camera.position.z, cameraPos[1], dt);
		var lookAtPos = assets.animations.getPosition('lookAt', elapsed);
		this.lookAt.x = lerp(this.lookAt.x, -lookAtPos[0], dt);
		this.lookAt.y = lerp(this.lookAt.y, lookAtPos[2], dt);
		this.lookAt.z = lerp(this.lookAt.z, lookAtPos[1], dt);
		this.camera.lookAt(this.lookAt);
		this.camera.updateMatrixWorld(true);

		[
			'finalSymbol',
			'headRotationDelay',
			'headRoundness',
			'introSymbol',
			'joOffset',
		].forEach(uniformName => {
			uniforms[uniformName].value = assets.animations.getValue(uniformName, elapsed);
		});
	}
}
