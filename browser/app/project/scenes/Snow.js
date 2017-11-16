
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import Particles from '../../engine/particles';

export default class Snow extends THREE.Scene {
	constructor() {
		super();

		let attributes = Particles.randomPositionAttribute(1000);
		Particles.createMeshes(attributes, assets.shaderMaterials.snow)
			.forEach(mesh => { this.add(mesh); });
	}
}
