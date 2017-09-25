
import * as THREE from 'three.js'
import { FrameBuffer } from './framebuffer'

export function ShaderPass (material, width, height, format, type)
{
	width = width || window.innerWidth;
	height = height || window.innerHeight;
	format = format || THREE.RGBAFormat;
	type = type || THREE.UnsignedByteType;
	this.frameBuffer = new FrameBuffer(width, height, format, type);
	this.scene = new THREE.Scene();
	this.geometry = new THREE.PlaneBufferGeometry( 2, 2 );
	this.camera = new THREE.Camera();
	this.camera.position.z = 1;
	this.material = material;
	this.scene.add(new THREE.Mesh(this.geometry, this.material));

	this.update = function ()
	{
		this.material.uniforms.frameBuffer.value = this.frameBuffer.getTexture();
		this.frameBuffer.swap();
		renderer.render(this.scene, this.camera, this.frameBuffer.getTarget(), true);
		return this.frameBuffer.getTexture();
	}

	this.getTexture = function ()
	{
		return this.frameBuffer.getTexture();
	}
}