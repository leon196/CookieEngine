
import * as THREE from 'three.js';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import Geometry from '../engine/geometry';

export default class Plant extends THREE.Object3D {

	constructor() {
		super();

		this.material = assets.shaders.plant;
		this.uniforms = this.material.uniforms;
		this.uniforms.lineThin = { value: 0 };
		this.uniforms.time = { value: 0 };

		this.count = 100;
		var attributes = {};
		attributes.position = { array:[], itemSize:3 };
		attributes.next = { array:[], itemSize:3 };
		attributes.prev = { array:[], itemSize:3 };

		for (var current = 0; current < this.count; ++current) {
			var angle = current * .2;
			attributes.position.array[current*3+0] = Math.cos(angle);
			attributes.position.array[current*3+1] = current * .01 + Math.sin(angle*3.)*.1;
			attributes.position.array[current*3+2] = Math.sin(angle);
		}
		for (var current = 0; current < this.count; ++current) {
			for (var v = 0; v < 3; ++v) {
				var next = Math.min(this.count-1, current+1);
				var prev = Math.max(0, current-1);
				attributes.next.array[current*3+v] = attributes.position.array[next*3+v];
				attributes.prev.array[current*3+v] = attributes.position.array[prev*3+v];
			}
		}
		this.geometries = Geometry.create(attributes, [8,4]);
		this.geometries.forEach(function(geometry){
			this.add(new THREE.Mesh(geometry, this.material));
		}.bind(this));

	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.lineThin.value = parameters.lineThin;

		this.geometries.forEach(function(geometry){
			var attributes = geometry.attributes;
			for (var current = 0; current < this.count; ++current) {
				var angle = current * .1 + elapsed;
				var radius = .5 + current * .005;
				// for (var x = 0; x < sub; ++x) {
					for (var f = 0; f < 4; ++f) {
						attributes.position.array[current*4*3+f*3+0] = radius * Math.cos(angle);
						attributes.position.array[current*4*3+f*3+1] = current * .003 + Math.sin(angle*3.)*.1;
						attributes.position.array[current*4*3+f*3+2] = radius * Math.sin(angle);
					}
				// }
			}
			for (var current = 0; current < this.count; ++current) {
				for (var f = 0; f < 4; ++f) {
					for (var v = 0; v < 3; ++v) {
						var next = Math.min(this.count-1, current+1);
						var prev = Math.max(0, current-1);
						attributes.next.array[current*4*3+f*3+v] = attributes.position.array[next*4*3+v];
						attributes.prev.array[current*4*3+f*3+v] = attributes.position.array[prev*4*3+v];
					}
				}
			}
			attributes.position.needsUpdate = true;
			attributes.next.needsUpdate = true;
			attributes.prev.needsUpdate = true;
		}.bind(this))
	}
}