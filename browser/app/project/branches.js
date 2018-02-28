
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
		this.parameters = {
			branchCount: 10,
			branchSegments: 5,
			build: (e => this.build()),
			color: [77, 204, 51],
			thin: .02,
			capStart: 1,
			capEnd: 1,
			growAngle: .5,
			growRadius: .5,
			growHeight: .5,
			growWave: 10.,
			growWaveScale: .2,
			growWaveOffset: 100.,
			growTwist: 2.,
		};
		this.uniforms = {
			time: { value: 0 },
			reset: { value: 0 },
			branchCount: { value: 0 },
			branchCountDimension: { value: 0 },
			branchSegments: { value: 0 },
			branchTexture: { value: 0 },
			branchTextureDimension: { value: 0 },
			branchParentCount: { value: 0 },
			branchParentCountDimension: { value: 0 },
			branchParentSegments: { value: 0 },
			branchParentTexture: { value: 0 },
			branchParentTextureDimension: { value: 0 },
		}
	}

	build () {
		// geometry
		var count = this.parameters.branchCount;
		var segments = this.parameters.branchSegments;
		var resolution = closestPowerOfTwo(Math.sqrt(count*(segments+1)));

		// uniforms
		this.uniforms.branchCount.value = count;
		this.uniforms.branchCountDimension.value = closestPowerOfTwo(Math.sqrt(count));
		this.uniforms.branchSegments.value = segments+1;
		this.uniforms.branchTextureDimension.value = resolution;
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
		this.uniforms.branchTexture.value = this.framebuffer.getTexture();
		this.framebuffer.update(0);
		this.uniforms.reset.value = 0.;

		// material
		var branchMaterial = assets.shaders.branch.clone();
		branchMaterial.side = THREE.DoubleSide;
		branchMaterial.uniforms = this.uniforms;
		assets.shaders.branch.cloned.push(branchMaterial);

		// meshes
		this.children.forEach(child => this.remove(child));
		Geometry.create(Geometry.randomPositionAttribute(count), [1, segments]).forEach(geometry => {
			var mesh = new THREE.Mesh(geometry, branchMaterial);
			mesh.frustumCulled = false;
			this.add(mesh);
		});
	}

	setParent (parent) {
		// geometry
		var count = parent.parameters.branchCount;
		var segments = parent.parameters.branchSegments;
		var resolution = closestPowerOfTwo(Math.sqrt(count*(segments+1)));

		// uniforms
		this.uniforms.branchParentCount.value = count;
		this.uniforms.branchParentCountDimension.value = closestPowerOfTwo(Math.sqrt(count));
		this.uniforms.branchParentSegments.value = segments+1;
		this.uniforms.branchParentTexture.value = parent.framebuffer.getTexture();
		this.uniforms.branchParentTextureDimension.value = resolution;
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		this.framebuffer.update();
	}
}