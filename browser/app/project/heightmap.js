
import * as THREE from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';

var size = 300.;

var heightmap = new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType });

heightmap.normalMap = new THREE.WebGLRenderTarget(size, size, { type: THREE.FloatType });

heightmap.init = function () {

	this.material = assets.shaders.heightmap;
	this.material.uniforms.time = { value: 0 };
	this.material.uniforms.normalMode = { value: 0 };

	this.quad = new THREE.Mesh(new THREE.PlaneGeometry(100,100,size,size), this.material);
	this.quad.rotateX(-Math.PI/2.);
	this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 100);
	renderer.render(this.quad, this.camera, heightmap);
}

heightmap.update = function (elapsed) {
	this.material.uniforms.time.value = elapsed;
	this.material.uniforms.normalMode.value = 0.;
	renderer.render(this.quad, this.camera, heightmap);
	this.material.uniforms.normalMode.value = 1.;
	renderer.render(this.quad, this.camera, heightmap.normalMap);
}

export default heightmap;