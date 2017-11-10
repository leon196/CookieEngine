
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Scene from './Scene';

export default class FilterScene extends Scene {
	constructor() {
		super();
		this.scene = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaderMaterials.filter);
	}

	update(elapsed) {
		super.update(elapsed);
	}
}
