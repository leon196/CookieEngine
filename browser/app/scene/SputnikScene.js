
import * as THREE from 'three.js'
import Scene from './Scene.js'
import assets from '../engine/assets.js'
import Geometry from '../engine/geometry.js'

export default class SputnikScene extends Scene {

	constructor() {
		super();
		var treeAttributes = assets.geometries.tree.children[0].geometry.attributes;
		let geometry = Geometry.createQuadFromPoints(treeAttributes);
		let material = assets.shaderMaterials.sprite;
		this.add(new THREE.Mesh(geometry, material));
	}

	update(elapsed) {
		super.update(elapsed);
	}
}