
import * as THREE from 'three.js';
import Scene from '../engine/scene';
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Particles from '../engine/particles';
import ShaderPass from '../engine/shaderpass';
import { lerp, clamp, arrayVec3Distance } from '../engine/misc';

export default class ParticlesScene extends Scene {
	constructor() {
		super('ParticlesScene');
		this.addSprites();
		this.addRainbowRibbons();
		this.addSnow();
		this.addPointCloud();
	}

	addSprites() {
			assets.textures.spritesheet.wrapS = THREE.RepeatWrapping;
			assets.textures.spritesheet.wrapT = THREE.RepeatWrapping;
			uniforms.spritesheet = { value: assets.textures.spritesheet };
			var image = assets.textures.spritesheet.image;
			uniforms.spritesheetFrame = { value: [image.width, image.height] };
			let attributes = Particles.randomPositionAttribute(32);
			Particles.createMeshes(attributes, assets.shaderMaterials.spritesheetExample)
				.forEach(mesh => { this.scene.add(mesh); });
	}

	addRainbowRibbons() {
		let attributes = Particles.randomPositionAttribute(100);
		Particles.createMeshes(attributes, assets.shaderMaterials.ribbonExample, [1,100])
			.forEach(mesh => {
				mesh.position.y = 20.;
				this.scene.add(mesh);
			});
	}

	addSnow() {
		let attributes = Particles.randomPositionAttribute(1000);
		Particles.createMeshes(attributes, assets.shaderMaterials.snowExample)
			.forEach(mesh => { this.scene.add(mesh); });
	}

	addPointCloud() {
		let attributes = assets.geometries.plantPoints.attributes;
		Particles.createMeshes(attributes, assets.shaderMaterials.pointCloudExample)
			.forEach(mesh => {
				mesh.position.x = -5.;
				mesh.position.y = 10.;
				this.scene.add(mesh);
			});
	}
}
