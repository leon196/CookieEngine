
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import uniforms from '../../engine/uniforms';
import Particles from '../../engine/particles';

export default class SpriteScene extends THREE.Scene {

	constructor() {
		super();

		assets.textures.spritesheet.wrapS = THREE.RepeatWrapping;
		assets.textures.spritesheet.wrapT = THREE.RepeatWrapping;
		uniforms.spritesheet = { value: assets.textures.spritesheet };
		var image = assets.textures.spritesheet.image;
		uniforms.spritesheetFrame = { value: [image.width, image.height] };
		let attributes = Particles.randomPositionAttribute(32);
		Particles.createMeshes(attributes, assets.shaderMaterials.spritesheetExample)
			.forEach(mesh => { this.add(mesh); });
	}
}
