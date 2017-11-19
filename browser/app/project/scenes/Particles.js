
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import uniforms from '../../engine/uniforms';
import PariclesSystem from '../../engine/particles';

export default class Particles extends THREE.Scene {

	constructor() {
		super();

    let attributes = PariclesSystem.randomPositionAttribute(64*64);
		PariclesSystem.createMeshes(attributes, assets.shaderMaterials.particles)
			.forEach(mesh => { this.add(mesh); });

    this.particleSystem = new PariclesSystem();
	}

	update() {
	}
}
