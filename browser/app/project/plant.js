
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
		this.addBranches();
		this.addBranches();

		this.branchesArray[1].setParent(this.branchesArray[0]);
		this.addDebug(this.branchesArray[1].framebuffer.getTexture());
	}

	addBranches () {
		var branches = new Branches();
		gui.remember(branches.parameters);
		gui.addUniforms('branch ' + this.branchesArray.length, branches.parameters, branches.uniforms);
		branches.build();
		this.branchesArray.push(branches);
		this.add(branches);
	}

	update(elapsed) {
		this.branchesArray.forEach(branches => {
			gui.updateUniforms(branches.parameters, branches.uniforms);
			branches.update(elapsed);
		})
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