
import * as THREE from 'three.js';
import camera from '../engine/camera';
import ShaderPass from '../engine/shaderpass';

export default class {
	constructor(name) {
		this.scene = new THREE.Scene();
		this.pass = new ShaderPass(
      null, name, 2,
      window.innerWidth, window.innerHeight,
      THREE.RGBAFormat, THREE.UnsignedByteType,
      THREE.NearestFilter, THREE.NearestFilter
    );
  }

  update(time) {
    this.pass.render(this.scene, camera);
  }

  resize(width, height) {
  }
}
