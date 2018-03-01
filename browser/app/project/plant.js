
import * as THREE from 'three.js';
import { closestPowerOfTwo } from '../engine/misc';
import { gui } from '../engine/gui';
import assets from '../engine/assets';
import parameters from '../engine/parameters';
import FrameBuffer from '../engine/framebuffer';
import Geometry from '../engine/geometry';
import Branches from './branches';

export default class Plant extends THREE.Object3D {

	constructor () {
		super();
		this.branchesArray = [];
		this.parameters = {
			build: e => this.build(),
		}
		var count = 2;
		var branchFolder = gui.addFolder('plant');
		branchFolder.add(this.parameters, 'build');
		for (var i = 0; i < count; ++i) {
			var branches = new Branches();
			gui.remember(branches.parameters);
			gui.addUniforms(branchFolder, 'branch ' + this.branchesArray.length, branches.parameters, branches.uniforms);
			this.branchesArray.push(branches);
			this.add(branches);
		}
		this.build();

		this.addDebug(this.branchesArray[0].framebuffer.getTexture());
	}

	update(elapsed) {
		this.branchesArray.forEach(branches => {
			gui.updateUniforms(branches.parameters, branches.uniforms);
			branches.update(elapsed);
		})
	}

	build () {
		for (var i = 0; i < this.branchesArray.length; ++i) {
			var branches = this.branchesArray[i];
			branches.build();
			if (i > 0) branches.setParent(this.branchesArray[i-1]);
		}
	}

	addDebug (texture) {
		var material = assets.shaders.debug.clone();
		material.uniforms.texture = { value: texture };
		material.side = THREE.DoubleSide;
		material.transparent = true;
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material);
		plane.rotateX(-Math.PI/2.);
		this.add(plane);
	}
}