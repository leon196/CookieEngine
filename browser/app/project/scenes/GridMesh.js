
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import Particles from '../../engine/particles';

export default class GridMesh extends THREE.Scene {
	constructor() {
		super();

		let attributes = Particles.randomPositionAttribute(64*64);
		Particles.createMeshes(attributes, assets.shaderMaterials.gridScreen)
			.forEach(mesh => { this.add(mesh); });
	}
}
