
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Particles from '../engine/particles';

export default class GridMeshScene extends THREE.Scene {
	constructor() {
		super();

		let attributes = Particles.randomPositionAttribute(64*64);
		Particles.createMeshes(attributes, assets.shaderMaterials.gridScreenExample)
			.forEach(mesh => { this.add(mesh); });
	}
}
