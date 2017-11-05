

import * as THREE from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';
import Scene from './Scene';

export default class RaymarchingScene extends Scene {
	constructor() {
		super();
		this.scene = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.raymarching);
	}

	update(elapsed) {
		super.update(elapsed);
	}
}
