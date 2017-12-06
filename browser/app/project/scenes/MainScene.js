
import * as THREE from 'three.js';
import assets from '../../engine/assets';
import { lerp, lerpArray } from '../../engine/misc';
import uniforms from '../../engine/uniforms';
import Scene from '../../engine/scene';
import Fire from './Fire';
import Skull from './Skull';
import Paper from './Paper';
import Raymarch from './Raymarch';
import Building from './Building';

export default class MainScene extends Scene {
	constructor() {
		super('sceneTexture');
		this.paperFire = new Fire();
		this.skull = new Skull();
		this.scenes = [
			this.paperFire,
			this.skull,
			new Building(),
		];
		this.scenes.forEach(scene => {
			this.add(scene);
		});
		this.uniforms = [
			'Skull', 'Lock', 'Electrify', 'Disolve'
		];
		this.uniformsVec3 = [
			'SkullPosition'
		];
		this.uniforms.forEach(name => {
			uniforms[name] = { value: assets.animations.getValue(name, 0) };
		});
		this.uniformsVec3.forEach(name => {
			uniforms[name] = { value: assets.animations.getPosition(name, 0) };
		});
	}
	update(time) {
		super.update(time);
		this.scenes.forEach(scene => {
			scene.update(time);
		});
		this.uniforms.forEach(name => {
			uniforms[name].value = lerp(uniforms[name].value, assets.animations.getValue(name, time), .1);
		});
		this.uniformsVec3.forEach(name => {
			uniforms[name].value = lerpArray(uniforms[name].value, assets.animations.getPosition(name, time), .1);
		});
		this.paperFire.visible = 0 !== assets.animations.getValue('FirePaper', time);
		this.skull.visible = 0 !== assets.animations.getValue('Skull', time);
	}
	setSize(w,h) {
		this.scenes.forEach(scene => {
			scene.setSize(w, h);
		})
	}
}
