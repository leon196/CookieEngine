
import * as THREE from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';

var heightmap = new THREE.WebGLRenderTarget(300, 300, {
	type: THREE.FloatType,
});

heightmap.init = function () {
	var noiseTexture = assets.textures.noise1;
	noiseTexture.wrapS = THREE.MirroredRepeatWrapping;
	noiseTexture.wrapT = THREE.MirroredRepeatWrapping;
	noiseTexture.needsUpdate = true;

	this.material = assets.shaders.heightmap;
	this.material.uniforms.noiseMap = { value: noiseTexture };
	this.material.uniforms.time = { value: 0 };

	this.quad = new THREE.Mesh(new THREE.PlaneGeometry(100,100,300,300), this.material);
	this.quad.rotateX(-Math.PI/2.);
	this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 100);
	renderer.render(this.quad, this.camera, heightmap);
}

heightmap.update = function (elapsed) {
	this.material.uniforms.time.value = elapsed;
	renderer.render(this.quad, this.camera, heightmap);
}

export default heightmap;