
import * as THREE from 'three.js';
import uniforms from './uniforms';
import renderer from './renderer';
import camera from './camera';
import FrameBuffer from './framebuffer';

export default class Scene extends THREE.Scene {

	constructor(uniformName) {
		super();
    let options = {
			type: THREE.FloatType,
		};
    this.frame = new FrameBuffer(options);
    this.uniformName = uniformName;
    uniforms[this.uniformName] = { value: 0 };
  }

  update(time) {
		uniforms[this.uniformName].value = this.frame.getTexture();
		this.frame.swap();
		renderer.render(this, camera, this.frame.getRenderTarget(), true);
  }

}
