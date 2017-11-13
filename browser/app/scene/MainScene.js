
import * as THREE from 'three.js';
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Scene from '../engine/scene';
import Geometry from '../engine/geometry';
import { simpleText } from '../engine/makeText';
import { lerp, clamp } from '../libs/misc';

export default class MainScene extends Scene {
	constructor() {
		super();
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 5;
		this.timePreviousFrame = 0;

		// this.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.simple));

		let count = 1;
		let attributes = {
			position: {
				array: Geometry.getRandomPoints(count),
				itemSize: 3
			}
		};
		this.addChildren(Geometry.create(count, attributes, [20,1], assets.shaderMaterials.particle));
	}

	update(elapsed) {
		super.update(elapsed);
		var dt = clamp(Math.abs(elapsed - this.timePreviousFrame), 0., 1.);
		this.timePreviousFrame = elapsed;
	}
}
