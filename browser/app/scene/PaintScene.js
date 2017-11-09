
import * as THREE from 'three.js'
import Scene from './Scene.js'
import assets from '../engine/assets.js'
import Geometry from '../engine/geometry.js'
import uniforms from '../engine/uniforms.js'
import { simpleText } from '../engine/makeText';

export default class PaintScene extends Scene {

	constructor() {
		super();
		var textureTitle = new THREE.Texture(simpleText('Cookie\nDemopaRty', 'rhinos_rocksregular', 220, 1024, true));
		textureTitle.needsUpdate = true;
		uniforms.framePaint.value = textureTitle;
	}

	update(elapsed) {
		super.update(elapsed);
	}
}
