
import { Mesh, PlaneGeometry } from 'three.js';
import assets from '../engine/assets';
import uniforms from '../engine/uniforms';
import Scene from '../engine/scene';

export default class Render extends Scene {

	constructor() {
		super('renderTexture');
		let mesh = new Mesh(new PlaneGeometry(1,1,1), assets.shaders.render);
		mesh.frustumCulled = false;
    this.add(mesh);

		uniforms.fadeBlack = { value: 0 };
  }

	update(time) {
		super.update(time);
		uniforms.fadeBlack.value = assets.animations.getValue('FadeBlack', time);
	}
}
