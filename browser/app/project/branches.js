
import * as THREE from 'three.js';
import { closestPowerOfTwo, getRandomPoints } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Branches extends THREE.Object3D {

	constructor() {
		super();
		this.count = 1;
		this.segments = [1,1];
		this.parameters = {
			color: [77, 204, 51],
			thin: .02,
			capStart: 1,
			capEnd: 1,
			grow: {
				angle: .5,
				radius: .5,
				height: .5,
				wave: 10.,
				waveScale: .2,
				waveOffset: 100.,
				twist: 2.,
			},
		};
		this.uniforms = {
			time: { value: 0 },
			reset: { value: 0 },
			count: { value: 0 },
			countDimension: { value: 0 },
			segments: { value: [0,0] },
			texture: { value: 0 },
			textureDimension: { value: 0 },
			parentCount: { value: 0 },
			parentCountDimension: { value: 0 },
			parentSegments: { value: [0,0] },
			parentTexture: { value: 0 },
			parentTextureDimension: { value: 0 },
		}
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.framebuffer.update();
	}

	build () {
		var resolution = closestPowerOfTwo(Math.sqrt(this.count*(this.segments[1]+1)));

		// uniforms
		this.uniforms.count.value = this.count;
		this.uniforms.countDimension.value = closestPowerOfTwo(Math.sqrt(this.count));
		this.uniforms.segments.value[0] = this.segments[0]+1;
		this.uniforms.segments.value[1] = this.segments[1]+1;
		this.uniforms.textureDimension.value = resolution;
		this.uniforms.reset.value = 1.;
		
		// framebuffer
		if (this.framebuffer) this.framebuffer.dispose();
		var seedMaterial = assets.shaders.seed.clone();
		seedMaterial.uniforms = this.uniforms;
		assets.shaders.seed.cloned.push(seedMaterial);
		this.framebuffer = new FrameBuffer({
			width: resolution,
			height: resolution,
			material: seedMaterial,
		});
		this.uniforms.texture.value = this.framebuffer.getTexture();
		this.framebuffer.update(0);
		this.uniforms.reset.value = 0.;

		// material
		var material = assets.shaders.branch.clone();
		material.side = THREE.DoubleSide;
		material.uniforms = this.uniforms;
		assets.shaders.branch.cloned.push(material);

		// meshes
		this.children.forEach(child => this.remove(child));
		var geometries = Geometry.create(Geometry.randomPositionAttribute(this.count), this.segments);
		geometries.forEach(geometry => {
			var mesh = new THREE.Mesh(geometry, material);
			mesh.frustumCulled = false;
			this.add(mesh);
		});
	}

	setGeometry (count, segments) {
		this.count = count || 10;
		this.segments = segments || [1,1];
	}

	setParent (parent) {
		this.uniforms.parentCount.value = parent.count;
		this.uniforms.parentCountDimension.value = closestPowerOfTwo(Math.sqrt(parent.count));
		this.uniforms.parentSegments.value[0] = parent.segments[0]+1;
		this.uniforms.parentSegments.value[1] = parent.segments[1]+1;
		this.uniforms.parentTexture.value = parent.framebuffer.getTexture();
		this.uniforms.parentTextureDimension.value = closestPowerOfTwo(Math.sqrt(parent.count*(parent.segments[1]+1)));
	}
}