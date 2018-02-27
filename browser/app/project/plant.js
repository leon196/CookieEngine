
import * as THREE from 'three.js';
import { closestPowerOfTwo } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';

export default class Plant extends THREE.Object3D {

	constructor() {
		super();
		this.setup();
		this.build();
	}

	setup () {
		this.branchCount = 10;
		this.branchSegments = [1, 5];
		this.parameters = {
			branchCount: 10,
			branchSegment: 5,
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
			branchCount: { value: this.branchCount },
			branchCountDimension: { value: 0 },
			branchSegments: { value: this.branchSegments },
			branchTexture: { value: 0 },
			branchTextureDimension: { value: 0 },
			framebuffer: { value: 0 },
		}
		assets.shaders.seed.uniforms = this.uniforms;
		assets.shaders.branch.uniforms = this.uniforms;
		assets.shaders.branch.side = THREE.DoubleSide;
		gui.remember(this.parameters);
		this.setupGUI();
	}

	build () {
		this.branchCount = this.parameters.branchCount;
		this.branchSegments[1] = this.parameters.branchSegment;
		this.branchTexture = FrameBuffer.createDataTexture(this.getOriginalSeed(), 3);
		this.uniforms.branchCount.value = this.branchCount;
		this.uniforms.branchCountDimension.value = closestPowerOfTwo(Math.sqrt(this.branchCount));
		this.uniforms.branchSegments.value = [this.branchSegments[0]+1., this.branchSegments[1]+1.];
		this.uniforms.branchTexture.value = this.branchTexture;
		this.uniforms.branchTextureDimension.value = this.branchTexture.image.width;
		this.uniforms.reset.value = 1.;
		if (this.framebuffer) this.framebuffer.dispose();
		this.framebuffer = new FrameBuffer({
			width: this.branchTexture.image.width,
			height: this.branchTexture.image.height,
			material: assets.shaders.seed,
		});
		this.uniforms.framebuffer.value = this.framebuffer.getTexture();
		this.framebuffer.update(0);
		this.uniforms.reset.value = 0.;
		this.children.forEach(child => this.remove(child));
		Geometry.create(Geometry.randomPositionAttribute(this.branchCount), this.branchSegments).forEach(geometry => {
			var mesh = new THREE.Mesh(geometry, assets.shaders.branch);
			mesh.frustumCulled = false;
			this.add(mesh);
		});
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		Object.keys(this.parameters).forEach(key => {
			var param = this.parameters[key];
			var type = typeof(param);
			if (type == 'number') {
				this.uniforms[key].value = param;
			} else if (type == 'object') {
				if (param.length && param.length == 3) {
					for (var c = 0; c < 3; ++c) this.uniforms[key].value[c] = param[c]/255;
				}
			}
		});
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

	addDebug () {
		var material = assets.shaders.debug.clone();
		material.uniforms.texture = { value: this.framebuffer.getTexture() };
		material.side = THREE.DoubleSide;
		material.transparent = true;
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material);
		plane.rotateX(-Math.PI/2.);
		this.add(plane);
	}

	setupGUI () {
		var folder = gui.addFolder('branch');
		Object.keys(this.parameters).forEach(key => {
			var param = this.parameters[key];
			var type = typeof(param);
			console.log(type)
			if (type == 'number') {
				this.uniforms[key] = { value: param };
				var item = folder.add(this.parameters, key);
				item.step(0.01);
			} else if (type == 'function') {
				folder.add(this.parameters, key);
			} else if (type == 'object') {
				if (param.length && param.length == 3) {
					this.uniforms[key] = { value: [param[0]/255,param[1]/255,param[2]/255] };
					folder.addColor(this.parameters, key);
				}
			}
		});
	}
}