

import * as THREE from 'three.js';
import parameters from '../engine/parameters';
import assets from '../engine/assets';
import Particle from '../engine/particle';
import Line from '../engine/line';
import Point from '../engine/point';
import animations from '../engine/animations';
import State from '../engine/state';
import { simpleText } from '../engine/makeText';
import uniforms from '../engine/uniforms';
import message from '../../asset/message';
import { lerp, clamp } from '../libs/misc';

export default class {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
		this.camera.position.y = 10;
		this.camera.position.z = 20;
		this.lastElapsed = 0;

		// this.controls = new OrbitControls( this.camera, renderer.domElement );
		// this.controls.rotateSpeed = 0.5;

		var treeAttributes = assets.geometries.tree.children[0].geometry.attributes;
		this.tree = new Line(treeAttributes, assets.shaderMaterials.tree);
		var dimension = 512;
		assets.shaderMaterials.snow.uniforms.dimension = { value: dimension };
		this.snow = new Point(dimension*dimension, assets.shaderMaterials.snow);
		dimension = 64;
		assets.shaderMaterials.rain.uniforms.dimension = { value: dimension };
		this.rain = new Point(dimension*dimension, assets.shaderMaterials.rain);
		this.smoke = new Particle(treeAttributes, assets.shaderMaterials.smoke, 100);

		var flashAttributes = assets.geometries.flash.children[0].geometry.attributes;
		this.flash = new Line(flashAttributes, assets.shaderMaterials.flash);

		this.fire = new Particle(treeAttributes, assets.shaderMaterials.fire, 1, true);
		this.leaf = new Particle(treeAttributes, assets.shaderMaterials.leaf, 10);

		this.currentMessage = 0;
		this.showMessage = false;
		this.hideMessage = false;
		this.labels = message.texts.map((text, i) => {
			const center = i == 0 || i == 10 || i == 11 || i == 5 || i > 12;
			const size = i == 10 ? 220 : 80;
			const font = i == 10 ? 'rhinos_rocksregular' : 'trashhand';
			const label = new THREE.Texture(simpleText(text, font, size, 1024, center));
			label.needsUpdate = true;
			return label;
		});
		assets.shaderMaterials.label.uniforms.uTexture = { value: this.labels[0] };
		this.screen = new THREE.Mesh(new THREE.PlaneGeometry( 5, 20, 32 ), assets.shaderMaterials.label);
		this.labelFireState = new State();
		this.messageStart = 0;

		this.scene.add( this.tree.mesh );
		this.scene.add( this.flash.mesh );
		this.scene.add( this.snow.mesh );
		this.scene.add( this.rain.mesh );
		this.scene.add( this.smoke.mesh );
		this.scene.add( this.fire.mesh );
		this.scene.add( this.leaf.mesh );
		this.scene.add(this.screen);

		this.globalParameter = Object.keys(parameters.global);
		for (var i = 0; i < this.globalParameter.length; ++i) {
			uniforms[this.globalParameter[i]].value = parameters.global[this.globalParameter[i]];
		}

		assets.shaderMaterials.rain.uniforms.blendStorm = { value: parameters.global.blendStorm };
		this.fire.uniforms.blendBurnOut = { value: parameters.global.blendBurnOut };

		this.parameterList = Object.keys(parameters.show);
		this.parameterMap = [];
		for (var i = 0; i < this.parameterList.length; ++i) {
			var name = this.parameterList[i].toLowerCase();
			name = name.slice(5, name.length);
			this.parameterMap.push(name);
			assets.shaderMaterials[this.parameterMap[i]].uniforms[this.parameterList[i]] = { value: parameters.show[this.parameterList[i]] };
		}

	}

	update(elapsed) {
		var dt = clamp(Math.abs(elapsed - this.lastElapsed), 0., 1.);
		this.lastElapsed = elapsed;
		this.tree.update(elapsed);
		this.snow.update(elapsed);
		this.rain.update(elapsed);
		this.smoke.update(elapsed);
		this.fire.update(elapsed);
		this.leaf.update(elapsed);
		// this.controls.update(elapsed);

		parameters.global.blendLight = animations.getValue('blendLight', elapsed);
		parameters.global.blendLabelAlpha = animations.getValue('blendLabelAlpha', elapsed);
		parameters.global.blendLabelFire = animations.getValue('blendLabelFire', elapsed);
		var messageIndex = animations.getValue('messageIndex', elapsed);
		if (messageIndex != this.currentMessage) {

			// this.scene.remove( this.labels[this.currentMessage].mesh );
			this.currentMessage = messageIndex;
			assets.shaderMaterials.label.uniforms.uTexture.value = this.labels[this.currentMessage];
			// this.scene.add( this.labels[this.currentMessage].mesh );
		}
		// this.updateMessage(elapsed);
		parameters.global.blendStorm = animations.getValue('blendStorm', elapsed);
		parameters.global.blendHeat = animations.getValue('blendHeat', elapsed);
		parameters.global.blendBurnOut = animations.getValue('blendBurnOut', elapsed);
		parameters.global.blendLeaf = animations.getValue('blendLeaf', elapsed);
		assets.shaderMaterials.rain.uniforms.blendStorm.value = parameters.global.blendStorm;
		assets.shaderMaterials.snow.uniforms.blendStorm.value = parameters.global.blendStorm;
		assets.shaderMaterials.tree.uniforms.blendStorm.value = parameters.global.blendStorm;
		this.fire.uniforms.blendBurnOut.value = parameters.global.blendBurnOut;

		var cameraPos = animations.getPosition('camera', elapsed);
		this.camera.position.x = lerp(this.camera.position.x, -cameraPos[0], dt);
		this.camera.position.y = lerp(this.camera.position.y, cameraPos[2], dt);
		this.camera.position.z = lerp(this.camera.position.z, cameraPos[1], dt);
		// this.camera.position.x = -cameraPos[0];
		// this.camera.position.y = cameraPos[2];
		// this.camera.position.z = cameraPos[1];
		this.camera.lookAt(new THREE.Vector3());
		var cameraRot = animations.getRotation('camera', elapsed);
		this.camera.rotation.x = -(cameraRot[0] - Math.PI * 0.5);
		this.camera.rotation.y = cameraRot[2] - Math.PI;
		this.camera.rotation.z = cameraRot[1];
		this.camera.updateMatrixWorld(true);

		for (var i = 0; i < this.parameterList.length; ++i) {
			// assets.shaderMaterials[this.parameterMap[i]].uniforms[this.parameterList[i]].value = parameter.show[this.parameterList[i]];
			assets.shaderMaterials[this.parameterMap[i]].uniforms[this.parameterList[i]].value = animations.getValue(this.parameterList[i], elapsed);
		}
		for (var i = 0; i < this.globalParameter.length; ++i) {
			uniforms[this.globalParameter[i]].value = parameters.global[this.globalParameter[i]];
		}
	}
}

