
import * as THREE from 'three.js'
import Scene from './Scene.js'
import assets from '../engine/assets.js'
import Geometry from '../engine/geometry.js'
import uniforms from '../engine/uniforms.js'
import { simpleText } from '../engine/makeText';

export default class TextScene extends Scene {

	constructor() {
		super();

		// grid of quads
		this.addChildren(Geometry.createQuadFromPoints(Geometry.getRandomPoints(128*128, 3), assets.shaderMaterials.text));

		this.message = [
			{ text: 'La Chimie\ndu Cookie',
				font: 'trashhand',
				size: 220, },
			{ text: 'artcode by ponk\nmusic by gaeel',
				font: 'trashhand',
				size: 150, },
			{ text: 'made with love\nfor alchimie 12',
				font: 'trashhand',
				size: 150, },
			{ text: 'cookie\ndemoparty',
				font: 'trashhand',
				size: 200, },
			{ text: '8, 9 December\nMontreuil',
				font: 'trashhand',
				size: 150, },
		];
		this.currentMessage = 0;
		this.textures = [];
		for (var i = 0; i < this.message.length; i++) {
			this.textures.push(new THREE.Texture(simpleText(this.message[i].text, this.message[i].font, this.message[i].size, 1024, true)));
			this.textures[i].needsUpdate = true;
		}
		this.updateTexture();
	}

	update(elapsed) {
		super.update(elapsed);

		var messageIndex = assets.animations.getValue('blendMessageIndex', elapsed);
		if (this.currentMessage != messageIndex) {
			this.currentMessage = messageIndex;
			this.updateTexture();
		}
	}

	updateTexture() {
		uniforms.frameTextureText.value = this.textures[this.currentMessage];
	}
}
