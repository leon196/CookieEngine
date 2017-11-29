
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import Scene from '../../engine/scene';
import camera from '../../engine/camera';
import uniforms from '../../engine/uniforms';
import FrameBuffer from '../../engine/FrameBuffer';
import Particles from '../../engine/particles';
import { decimateAttributes, lerp } from '../../engine/misc';

export default class Paper extends Scene {

	constructor() {
		super('paperSceneTexture');

		let attributes = Particles.randomPositionAttribute(1000);
		Particles.createMeshes(attributes, assets.shaders.paper, [8,8])
			.forEach(mesh => {
				mesh.frustumCulled = false;
				this.add(mesh);
			});

		this.uniformNames = [ 'Paper' ];
		this.valueBlend = {};
		this.blendRatio = .1;
		this.uniformNames.forEach(name => {
			let value = assets.animations.getValue(name, 0.);
			uniforms[name] = { value: value };
			this.valueBlend[name] = value;
		});
	}

	update(time) {
		super.update(time);
		this.uniformNames.forEach(name => {
			this.valueBlend[name] = lerp(this.valueBlend[name], assets.animations.getValue(name, time), this.blendRatio);
			uniforms[name].value = this.valueBlend[name];
		});
	}
}
