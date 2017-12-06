
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import renderer from '../../engine/renderer';
import Scene from '../../engine/scene';
import camera from '../../engine/camera';
import uniforms from '../../engine/uniforms';
import FrameBuffer from '../../engine/FrameBuffer';
import Paricles from '../../engine/particles';
import { decimateAttributes } from '../../engine/misc';

export default class Skull extends Scene {

	constructor() {
		super('skullSceneTexture');
		var options;

		var geometry = assets.geometries.skull;
		geometry = new THREE.WireframeGeometry(geometry);
		var count = geometry.attributes.position.array.length / 3;
		var array = [];
		for (var i = 0; i < count; ++i) {
			array.push(i);
		}
		geometry.addAttribute('seed', new THREE.BufferAttribute(new Float32Array(array), 1));
		this.add(new THREE.LineSegments(geometry, assets.shaders.skull));
	}

	update(time) {
		super.update(time);
	}
}
