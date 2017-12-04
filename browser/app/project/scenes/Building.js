
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

export default class Building extends Scene {

	constructor() {
		super('buildingSceneTexture');

		let geometry = new THREE.BufferGeometry();
		let attributes = { position: { array: [], itemSize: 3 }, normal: { array: [], itemSize: 3 } }
		let numbers = [];
		let indexes = [];
		let geometries = [];

		for (var i = 0; i < 100; ++i) {
			geometries.push(new THREE.BoxBufferGeometry(1,1,1));
		}

		let keys = Object.keys(attributes);
		let geometryNumber = 0;
		geometries.forEach(geo => {

			var start = attributes.position.array.length / 3;
			var array = Array.from(geo.index.array);
			for (var j = 0; j < array.length; ++j) {
				indexes.push(start+array[j]);
			}

			keys.forEach(name => {
				attributes[name].array = attributes[name].array.concat(Array.from(geo.attributes[name].array));
			})

			var count = geo.attributes.position.array.length / 3;
			for (var i = 0; i < count; ++i) {
				numbers.push(geometryNumber);
			}
			geometryNumber += 1;
		});
		keys.forEach(name => {
			geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(attributes[name].array), attributes[name].itemSize));
		});
		geometry.addAttribute('number', new THREE.BufferAttribute(new Float32Array(numbers), 1));
		geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indexes), 1));

		var min = -1000;
		var max = 1000;
		geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));
		geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), max);
		this.add(new THREE.Mesh(geometry, assets.shaders.building));
	}

	update(time) {
		super.update(time);
	}
}
