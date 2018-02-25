
import * as THREE from 'three.js';
import { closestPowerOfTwo } from '../engine/misc';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Plant extends THREE.Object3D {

	constructor() {
		super();

		this.count = 8;
		this.segments = [6, 30];

		this.material = assets.shaders.plant;
		this.uniforms = this.material.uniforms;
		this.uniforms.thin = { value: 0 };
		this.uniforms.count = { value: closestPowerOfTwo(Math.sqrt(this.count)) };
		this.uniforms.segments = { value: [this.segments[0]+1, this.segments[1]+1] };
		this.uniforms.time = { value: 0 };

		var array = [];
		for (var branch = 0; branch < this.count; ++branch) {
			for (var segment = 0; segment < this.segments[1]+1; ++segment) {
				var angle = (branch / this.count) * Math.PI * 2. + Math.sin(segment * .3) * .5;
				var radius = segment * .05;
				var x = radius * Math.cos(angle);
				var y = segment * .05;
				var z = radius * Math.sin(angle);
				array.push(x,y,z);
			}
		}

		this.dataTexture = FrameBuffer.createDataTexture(array, 3);
		this.uniforms.dataTexture = { value: this.dataTexture };
		this.uniforms.dimension = { value: this.dataTexture.image.width };

		this.geometries = Geometry.create(Geometry.randomPositionAttribute(this.count), this.segments);
		this.geometries.forEach(function(geometry){
			var mesh = new THREE.Mesh(geometry, this.material);
			mesh.frustumCulled = false;
			this.add(mesh);
		}.bind(this));

		assets.shaders.mesh.uniforms.texture = { value: this.dataTexture };
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), assets.shaders.mesh);
		plane.rotateX(-Math.PI/2.);
		this.add(plane);

		this.uniforms.framebuffer = { value: 0 };
		assets.shaders.seed.uniforms.dataTexture = { value: this.dataTexture };
		assets.shaders.seed.uniforms.reset = { value: 1 };
		var dimension = this.dataTexture.image.width;
		this.framebuffer = new FrameBuffer({
			width: dimension, height: dimension,
			material: assets.shaders.seed,
		});
		this.framebuffer.update(0);
		assets.shaders.seed.uniforms.reset.value = 0.;
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.thin.value = parameters.thin;

		assets.shaders.mesh.uniforms.texture.value = this.framebuffer.getTexture();
		this.uniforms.dataTexture.value = this.framebuffer.getTexture();
		this.framebuffer.update(elapsed);
	}
}