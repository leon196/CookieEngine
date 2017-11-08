
import * as THREE from 'three.js'
import Scene from './Scene.js'
import assets from '../engine/assets.js'
import Geometry from '../engine/geometry.js'

export default class PaperScene extends Scene {

	constructor() {
		super();
		var attributes = assets.geometries.tree.children[0].geometry.attributes;
		let geometry = Geometry.createQuadFromPoints(attributes, [1,10]);
		let material = assets.shaderMaterials.paper;
		this.add(new THREE.Mesh(geometry, material));
	}

	update(elapsed) {
		super.update(elapsed);
	}
}
