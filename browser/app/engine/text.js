
import * as THREE from 'three.js';
import assets from './assets';

export default class {
	constructor(message, mat) {
		this.geometry = new THREE.TextGeometry(message, {
			font: assets.fonts.coffee,
			size: 1.,
			height: .01,
			curveSegments: 36,
		});

		this.geometry.computeBoundingBox();
		this.geometry.center();
		this.mesh = new THREE.Mesh( this.geometry, mat );
	}

	update() {
	}
}
