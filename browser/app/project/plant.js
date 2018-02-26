
import * as THREE from 'three.js';
import { closestPowerOfTwo } from '../engine/misc';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Plant extends THREE.Object3D {

	constructor() {
		super();

		this.branchCount = 8;
		this.branchSegments = [3, 30];
		this.dataTexture = FrameBuffer.createDataTexture(this.getOriginalSeed(), 3);

		this.uniforms = {
			time: { value: 0 },
			reset: { value: 1 },
			branchThin: { value: parameters.branchThin },
			branchCount: { value: this.branchCount },
			branchCountDimension: { value: closestPowerOfTwo(Math.sqrt(this.branchCount)) },
			branchSegments: { value: [this.branchSegments[0]+1., this.branchSegments[1]+1.] },
			dataTexture: { value: this.dataTexture },
			dataTextureDimension: { value: this.dataTexture.image.width },
			framebuffer: { value: 0 },
		}

		assets.shaders.seed.uniforms = this.uniforms;
		this.framebuffer = new FrameBuffer({
			width: this.dataTexture.image.width,
			height: this.dataTexture.image.height,
			material: assets.shaders.seed,
		});
		this.framebuffer.update(0);
		this.uniforms.reset.value = 0.;

		assets.shaders.plant.uniforms = this.uniforms;
		Geometry.create(Geometry.randomPositionAttribute(this.branchCount), this.branchSegments)
		.forEach(geometry => {
			var mesh = new THREE.Mesh(geometry, assets.shaders.plant);
			mesh.frustumCulled = false;
			this.add(mesh);
		});

		var material = assets.shaders.mesh.clone();
		material.uniforms.texture = { value: this.framebuffer.getTexture() };
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material);
		plane.rotateX(-Math.PI/2.);
		plane.translateX(1.);
		this.add(plane);
		material = assets.shaders.mesh.clone();
		material.uniforms.texture = { value: this.dataTexture };
		plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material);
		plane.rotateX(-Math.PI/2.);
		plane.translateX(-1.);
		this.add(plane);
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.uniforms.branchThin.value = parameters.branchThin;
		this.uniforms.framebuffer.value = this.framebuffer.getTexture();
		this.framebuffer.update();
	}

	getOriginalSeed () {
		var array = [];
		for (var branch = 0; branch < this.branchCount; ++branch) {
			for (var segment = 0; segment < this.branchSegments[1]+1.; ++segment) {
				var angle = (branch / this.branchCount) * Math.PI * 2. + Math.sin(segment * .3) * .5;
				var radius = segment * .05;
				var x = radius * Math.cos(angle);
				var y = segment * .05;
				var z = radius * Math.sin(angle);
				array.push(x,y,z);
			}
		}
		return array;
	}
}