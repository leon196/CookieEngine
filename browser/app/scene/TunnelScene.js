

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
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 40;
		this.lookAt = new THREE.Vector3();
		this.lastElapsed = 0;

		this.controls = new OrbitControls( this.camera, renderer.domElement );
		this.controls.rotateSpeed = 0.5;

		uniforms.jonathanTexture = { value: assets.materials.Jonathan2.map };
		var geometry = assets.geometries.Jonathan10k.children[0].geometry;
		this.scene.add(new THREE.Mesh(geometry, assets.shaderMaterials.meshTunnel));

		var text = new THREE.Texture(simpleText('A', 'bebas', 144, 128, 128, true));
		text.wrapS = THREE.RepeatWrapping;
		text.needsUpdate = true;
		uniforms.ribbonText = { value: text };

		Geometry.createRibbons(1, 100, assets.shaderMaterials.ribbonTunnel)
			.forEach(mesh => this.scene.add(mesh));

		Geometry.createRibbons(1, 128, assets.shaderMaterials.ribbonScreen)
			.forEach(mesh => this.scene.add(mesh));
	}

	update(elapsed) {
		// var dt = clamp(Math.abs(elapsed - this.lastElapsed), 0., 1.);
		// var cameraPos = assets.animations.getPosition('camera', elapsed);
		// this.camera.position.x = lerp(this.camera.position.x, -cameraPos[0], dt);
		// this.camera.position.y = lerp(this.camera.position.y, cameraPos[2], dt);
		// this.camera.position.z = lerp(this.camera.position.z, cameraPos[1], dt);
		// var lookAtPos = assets.animations.getPosition('lookAt', elapsed);
		// this.lookAt.x = lerp(this.lookAt.x, -lookAtPos[0], dt);
		// this.lookAt.y = lerp(this.lookAt.y, lookAtPos[2], dt);
		// this.lookAt.z = lerp(this.lookAt.z, lookAtPos[1], dt);
		// this.camera.lookAt(this.lookAt);
		// this.camera.updateMatrixWorld(true);
	}
}
