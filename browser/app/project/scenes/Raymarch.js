
import { Mesh, PlaneGeometry } from 'three.js';
import assets from '../../engine/assets';
import uniforms from '../../engine/uniforms';
import Scene from '../../engine/scene';

export default class Raymarch extends Scene {

	constructor() {
		super('raymarchTexture');
		let mesh = new Mesh(new PlaneGeometry(1,1,1), assets.shaders.raymarchRooms);
		mesh.frustumCulled = false;
    this.add(mesh);
  }

}
