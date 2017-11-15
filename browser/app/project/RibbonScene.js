
import * as THREE from 'three.js';
import assets from '../engine/assets';
import Particles from '../engine/particles';

export default class RibbonScene extends THREE.Scene {

	constructor() {
		super();

		let attributes = Particles.randomPositionAttribute(100);
		Particles.createMeshes(attributes, assets.shaderMaterials.ribbonExample, [1,100])
			.forEach(mesh => {
				mesh.position.y = 20.;
				this.add(mesh);
			});
	}
}
