
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

let GeometryType = {
	Box: 0,
	Stick: 1,
	Stairs: 2,
};

export default class Building extends Scene {

	constructor() {
		super('buildingSceneTexture');

		this.attributes = { position: { array: [], itemSize: 3 }, normal: { array: [], itemSize: 3 } }
		this.geometries = [];
		this.types = [];
		this.counts = [];

		this.addBox(100, .1,5.,.1, GeometryType.Stick, 5,2.5,0);
		this.addBox(100, .1,5.,.1, GeometryType.Stick, -5,2.5,0);
		this.addBox(10, 1,1,1, GeometryType.Box, 2,0,0);
		this.addBox(10, 1,1,1, GeometryType.Box, -2,0,0);

		let geometry = assets.geometries.stairs.children[0].geometry;
		this.addGeometry(10, geometry.clone(), GeometryType.Stairs, 5,0,0);
		this.addGeometry(10, geometry.clone(), GeometryType.Stairs, -5,0,0, -1,1,1);

		this.buildBufferGeometry();
	}

	addBox(count, x, y, z, type, xx, yy, zz, sx, sy, sz) {
		let boxGeometry = new THREE.BoxBufferGeometry(x,y,z);
		let array = boxGeometry.attributes.position.array;
		xx = xx || 0; yy = yy || 0; zz = zz || 0;
		sx = sx || 1; sy = sy || 1; sz = sz || 1;
		for (var p = 0; p+2 < array.length; p += 3) {
			array[p] *= sx;
			array[p+1] *= sy;
			array[p+2] *= sz;
			array[p] += xx;
			array[p+1] += yy;
			array[p+2] += zz;
		}
		for (var i = 0; i < count; ++i) {
			this.geometries.push(boxGeometry);

			var len = boxGeometry.attributes.position.array.length / 3;
			for (var j = 0; j < len; ++j) {
				this.types.push(type);
				this.counts.push(count);
			}
		}
	}

	addGeometry(count, geometry, type, xx, yy, zz, sx, sy, sz) {
		let array = geometry.attributes.position.array;
		xx = xx || 0; yy = yy || 0; zz = zz || 0;
		sx = sx || 1; sy = sy || 1; sz = sz || 1;
		for (var p = 0; p+2 < array.length; p += 3) {
			array[p] *= sx;
			array[p+1] *= sy;
			array[p+2] *= sz;
			array[p] += xx;
			array[p+1] += yy;
			array[p+2] += zz;
		}
		for (var i = 0; i < count; ++i) {
			this.geometries.push(geometry);

			var len = geometry.attributes.position.array.length / 3;
			for (var j = 0; j < len; ++j) {
				this.types.push(type);
				this.counts.push(count);
			}
		}
	}

	buildBufferGeometry() {
		let geometry = new THREE.BufferGeometry();
		let keys = Object.keys(this.attributes);
		let geometryNumber = 0;
		let numbers = [];
		let indexes = [];
		this.geometries.forEach(geo => {

			var start = this.attributes.position.array.length / 3;
			if (geo.index !== null) {
				var array = Array.from(geo.index.array);
				for (var j = 0; j < array.length; ++j) {
					indexes.push(start+array[j]);
				}
			} else {
				var total = geo.attributes.position.array.length / 3;
				for (var j = 0; j < total; ++j) {
					indexes.push(start+j);
				}
			}

			keys.forEach(name => {
				this.attributes[name].array = this.attributes[name].array.concat(Array.from(geo.attributes[name].array));
			})

			var count = geo.attributes.position.array.length / 3;
			for (var i = 0; i < count; ++i) {
				numbers.push(geometryNumber);
			}
			geometryNumber += 1;
		});
		keys.forEach(name => {
			geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(this.attributes[name].array), this.attributes[name].itemSize));
		});
		geometry.addAttribute('number', new THREE.BufferAttribute(new Float32Array(numbers), 1));
		geometry.addAttribute('type', new THREE.BufferAttribute(new Float32Array(this.types), 1));
		geometry.addAttribute('count', new THREE.BufferAttribute(new Float32Array(this.counts), 1));
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
