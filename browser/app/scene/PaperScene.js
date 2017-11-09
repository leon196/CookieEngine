
import * as THREE from 'three.js'
import Scene from './Scene.js'
import assets from '../engine/assets.js'
import Geometry from '../engine/geometry.js'

export default class PaperScene extends Scene {

	constructor() {
		super();
		// let geometry = Geometry.createQuadFromPoints(attributes, [1,1]);
		// let material = assets.shaderMaterials.paper;
		// this.add(new THREE.Mesh(geometry, material));
		// this.add(new THREE.Mesh(geometry, material));
		// attributes = Geometry.getRandomAttributes(16*16);
		// geometry = Geometry.createQuadFromPoints(attributes, [1,20]);
		// material = assets.shaderMaterials.lines;
		// this.add(new THREE.Mesh(geometry, material));
		this.addChildren(Geometry.createQuadFromPoints(Geometry.getRandomPoints(96*96, 3), assets.shaderMaterials.paint));
		// this.addChildren(Geometry.createQuadFromPoints(Geometry.getRandomPoints(96*96, 3), assets.shaderMaterials.paper));
		this.addChildren(Geometry.createQuadFromPoints(Geometry.getRandomPoints(16*16, 3), assets.shaderMaterials.lines, [1,20]));
	}

	update(elapsed) {
		super.update(elapsed);
	}
}
