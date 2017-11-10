
import * as THREE from 'three.js'
import Scene from './Scene.js'
import assets from '../engine/assets.js'
import Geometry from '../engine/geometry.js'
import { lerp } from '../libs/misc.js'

export default class PaperScene extends Scene {

	constructor() {
		super();
		// let geometry = Geometry.createQuadFromPoints(attributes, [1,1]);
		// let material = assets.shaderMaterials.paper;
		// this.add(new THREE.Mesh(geometry, material));
		// this.add(new THREE.Mesh(geometry, material));
		// attributes = Geometry.getRandomAttributes(16*16);
		// geometry = Geometry.createQuadFromPoints(attributes, [1,20]);
		// material = assets.shaderMaterials.lines;
		// this.add(new THREE.Mesh(geometry, material));
		this.addChildren(Geometry.createQuadFromPoints(Geometry.getRandomPoints(64*64, 3), assets.shaderMaterials.paper));
		this.addChildren(Geometry.createQuadFromPoints(Geometry.getRandomPoints(5*5, 3), assets.shaderMaterials.lines, [1,20]));
		this.addChildren(Geometry.createQuadFromPoints(Geometry.getRandomPoints(5*5, 3), assets.shaderMaterials.feather, [1,20]));

		this.lookAt = new THREE.Vector3();
		this.positionDelta = [0,0,0];
		this.targetDelta = [0,0,0];
		this.last = 0;
	}

	update(elapsed) {
		super.update(elapsed);
		var delta = Math.min(1., Math.max(.01,(elapsed - this.last)*5.));

		var position = assets.animations.getPosition('Camera', elapsed);
		var target = assets.animations.getPosition('Target', elapsed);
		this.positionDelta[0] = lerp(this.positionDelta[0], position[0], delta);
		this.positionDelta[1] = lerp(this.positionDelta[1], position[1], delta);
		this.positionDelta[2] = lerp(this.positionDelta[2], position[2], delta);
		this.camera.position.x = -this.positionDelta[0];
		this.camera.position.y = this.positionDelta[2];
		this.camera.position.z = this.positionDelta[1];
		this.lookAt.x = -target[0];
		this.lookAt.y = target[2];
		this.lookAt.z = target[1];
		this.camera.lookAt(this.lookAt);
		this.camera.updateMatrixWorld(true);

		this.last = elapsed;
	}
}
