
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import Particles from '../../engine/particles';

export default class PointCloudScene extends THREE.Scene {
	constructor() {
		super();

		let attributes = assets.geometries.plantPoints.attributes;
		Particles.createMeshes(attributes, assets.shaderMaterials.pointCloud)
			.forEach(mesh => {
				mesh.position.x = -5.;
				mesh.position.y = 10.;
				this.add(mesh);
			});
	}
}
