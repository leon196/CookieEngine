
import { Mesh, PlaneGeometry } from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';
import Scene from '../engine/scene';
import Keyboard from '../engine/keyboard';

export default class Render extends Scene {

	constructor() {
		super('renderTexture');
    this.add(new Mesh(new PlaneGeometry(1,1,1), assets.shaders.render));
  }

	update(time) {
		super.update(time);

		if (Keyboard.Space.down) {
			Keyboard.Space.down = false;
			var w = window.open('', '');
			w.document.title = "screenshot";
			w.document.body.style.backgroundColor = "rgba(0,0,0,1)";
			var img = new Image();
			img.src = renderer.domElement.toDataURL();
			w.document.body.appendChild(img);
		}
	}

}
