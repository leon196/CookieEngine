
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

		this.sequenceCount = 10;
		this.sequenceSegments = [1, 20];
		this.sequenceTexture = FrameBuffer.createDataTexture(this.getOriginalSeed(), 3);

		this.parameters = {
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
			reset: { value: 1 },
			sequenceCount: { value: this.sequenceCount },
			sequenceCountDimension: { value: closestPowerOfTwo(Math.sqrt(this.sequenceCount)) },
			sequenceSegments: { value: [this.sequenceSegments[0]+1., this.sequenceSegments[1]+1.] },
			sequenceTexture: { value: this.sequenceTexture },
			sequenceTextureDimension: { value: this.sequenceTexture.image.width },
			framebuffer: { value: 0 },
		}
		gui.remember(this.parameters);
		Object.keys(this.parameters).forEach(key => {
			var param = this.parameters[key];
			var type = typeof(param);
			if (type == 'number') {
				this.uniforms[key] = { value: param };
				var item = gui.add(this.parameters, key);
				item.step(0.01);
			} else {
				if (param.length && param.length == 3) {
					this.uniforms[key] = { value: [param[0]/255,param[1]/255,param[2]/255] };
					gui.addColor(this.parameters, key);
				}
			}
		});

		assets.shaders.node.uniforms = this.uniforms;
		this.framebuffer = new FrameBuffer({
			width: this.sequenceTexture.image.width,
			height: this.sequenceTexture.image.height,
			material: assets.shaders.node,
		});
		this.uniforms.framebuffer.value = this.framebuffer.getTexture();
		this.framebuffer.update(0);
		this.uniforms.reset.value = 0.;

		assets.shaders.line.uniforms = this.uniforms;
		assets.shaders.line.side = THREE.DoubleSide;
		Geometry.create(Geometry.randomPositionAttribute(this.sequenceCount), this.sequenceSegments)
		.forEach(geometry => {
			var mesh = new THREE.Mesh(geometry, assets.shaders.line);
			mesh.frustumCulled = false;
			this.add(mesh);
		});

		var material = assets.shaders.debug.clone();
		material.uniforms.texture = { value: this.framebuffer.getTexture() };
		material.side = THREE.DoubleSide;
		material.transparent = true;
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material);
		plane.rotateX(-Math.PI/2.);
		this.add(plane);
	}

	update (elapsed) {
		this.uniforms.time.value = elapsed;
		Object.keys(this.parameters).forEach(key => {
			var param = this.parameters[key];
			var type = typeof(param);
			if (type == 'number') {
				this.uniforms[key].value = param;
			} else {
				if (param.length && param.length == 3) {
					for (var c = 0; c < 3; ++c) this.uniforms[key].value[c] = param[c]/255;
				}
			}
		});
		this.framebuffer.update();
	}

	getOriginalSeed () {
		var array = [];
		for (var sequence = 0; sequence < this.sequenceCount; ++sequence) {
			for (var segment = 0; segment < this.sequenceSegments[1]+1.; ++segment) {
				var angle = (sequence / this.sequenceCount) * Math.PI * 2. + Math.sin(segment * .3) * .5;
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