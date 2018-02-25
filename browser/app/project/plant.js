
import * as THREE from 'three.js';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Plant extends THREE.Object3D {

	constructor() {
		super();

		this.count = 100;

		this.material = assets.shaders.plant;
		this.uniforms = this.material.uniforms;
		this.uniforms.thin = { value: 0 };
		this.uniforms.time = { value: 0 };

		var attributes = { position: { array:[], itemSize:3 } };
		for (var current = 0; current < this.count; ++current) {
			var angle = current * .2;
			var x = Math.cos(angle);
			var y = current * .01 + Math.sin(angle*3.)*.1;
			var z = Math.sin(angle);
			attributes.position.array.push(x,y,z);
		}

		this.dataTexture = FrameBuffer.createDataTexture(attributes.position.array, 3);
		this.uniforms.dataTexture = { value: this.dataTexture };
		this.uniforms.dimension = { value: this.dataTexture.image.width };

		this.geometries = Geometry.create(attributes, [8,4]);
		this.geometries.forEach(function(geometry){
			this.add(new THREE.Mesh(geometry, this.material));
		}.bind(this));

		assets.shaders.mesh.uniforms.texture = { value: this.dataTexture };
		this.add(new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.2), assets.shaders.mesh));

		this.uniforms.framebuffer = { value: 0 };
		assets.shaders.seed.uniforms.dataTexture = { value: this.dataTexture };
		var dimension = this.dataTexture.image.width;
		this.framebuffer = new FrameBuffer({
			width: dimension, height: dimension,
			material: assets.shaders.seed,
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.thin.value = parameters.thin;

		assets.shaders.mesh.uniforms.texture.value = this.framebuffer.getTexture();
		this.uniforms.framebuffer.value = this.framebuffer.getTexture();
		this.framebuffer.update(elapsed);
	}
}