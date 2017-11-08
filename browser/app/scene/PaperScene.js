
import * as THREE from 'three.js'
import Scene from './Scene.js'
import assets from '../engine/assets.js'
import Geometry from '../engine/geometry.js'

export default class PaperScene extends Scene {

	constructor() {
		super();
		let attributes = Geometry.getRandomAttributes(64*64);
		let geometry = Geometry.createQuadFromPoints(attributes, [1,1]);
		let material = assets.shaderMaterials.paper;
		this.add(new THREE.Mesh(geometry, material));
	}

	update(elapsed) {
		super.update(elapsed);
	}
}
