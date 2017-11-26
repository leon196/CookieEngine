
import { Mesh, PlaneGeometry } from 'three.js';
import assets from '../engine/assets';
import Scene from '../engine/scene';

export default class Render extends Scene {

	constructor() {
		super('renderTexture');
    this.add(new Mesh(new PlaneGeometry(1,1,1), assets.shaderMaterials.filter));
  }

}
