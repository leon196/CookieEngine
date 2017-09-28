

import * as THREE from 'three.js';
import { material } from '../editor/material'
import { parameter } from '../editor/parameter'
import { asset } from '../editor/asset'
import { Particle } from '../engine/particle';
import { Line } from '../engine/line';
import { Point } from '../engine/point';
import { Text } from '../engine/text';
import { OrbitControls } from '../utils/OrbitControls';
import utils from '../utils/utils';
import { renderer } from '../engine/renderer';
import animations from '../engine/animations';
import { State } from '../utils/state';
import { key } from '../utils/keyboard';
import { message } from '../editor/message';
import getTime from '../engine/getTime';
import { makeText } from '../utils/makeText';

export function MainScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	this.camera.position.y = 10;
	this.camera.position.z = 20;

	// this.controls = new OrbitControls( this.camera, renderer.domElement );
	// this.controls.rotateSpeed = 0.5;

	var treeAttributes = asset.geometry["tree"].children[0].geometry.attributes;
	this.tree = new Line(treeAttributes, material.tree);
	var dimension = 512;
	material.snow.uniforms.dimension = { value: dimension };
	this.snow = new Point(dimension*dimension, material.snow);
	dimension = 64;
	material.rain.uniforms.dimension = { value: dimension };
	this.rain = new Point(dimension*dimension, material.rain);
	this.smoke = new Particle(treeAttributes, material.smoke, 100);

	var flashAttributes = asset.geometry["flash"].children[0].geometry.attributes;
	this.flash = new Line(flashAttributes, material.flash);

	this.fire = new Particle(treeAttributes, material.fire, 1, true);
	this.leaf = new Particle(treeAttributes, material.leaf, 10);
	
	this.currentMessage = 0;
	this.showMessage = false;
	this.hideMessage = false;
	this.labels = [];
	for (var i = 0; i < message.text.length; i++) {
		var center = i == 0 || i == 10 || i == 11 || i == 5 || i > 12;
		var size = i == 10 ? 180 : 80;
		var font = i == 10 ? 'sunrise' : 'lemon';
		this.labels.push(new THREE.Texture(makeText.simple(message.text[i], font, size, 1024, center)));
		this.labels[i].needsUpdate = true;
	}
	material.label.uniforms.uTexture = { value: this.labels[0] };
	this.screen = new THREE.Mesh(new THREE.PlaneGeometry( 5, 20, 32 ), material.label);
	this.labelFireState = new State();
	this.messageStart = 0;

	this.scene.add( this.tree.mesh );
	this.scene.add( this.flash.mesh );
	this.scene.add( this.snow.mesh );
	this.scene.add( this.rain.mesh );
	this.scene.add( this.smoke.mesh );
	this.scene.add( this.fire.mesh );
	this.scene.add( this.leaf.mesh );
	this.scene.add(this.screen)

	this.globalParameter = Object.keys(parameter.global);
	for (var i = 0; i < this.globalParameter.length; ++i) {
		material.defaultUniforms[this.globalParameter[i]].value = parameter.global[this.globalParameter[i]];
	}

	material.rain.uniforms.blendStorm = { value: parameter.global.blendStorm };
	this.fire.uniforms.blendBurnOut = { value: parameter.global.blendBurnOut };

	this.parameterList = Object.keys(parameter.show);
	this.parameterMap = []
	for (var i = 0; i < this.parameterList.length; ++i) {
		var name = this.parameterList[i].toLowerCase();
		name = name.slice(5, name.length);
		this.parameterMap.push(name);
		material[this.parameterMap[i]].uniforms[this.parameterList[i]] = { value: parameter.show[this.parameterList[i]] };
	}

	this.update = function ()
	{
		var elapsed = getTime();
		this.tree.update(elapsed);
		this.snow.update(elapsed);
		this.rain.update(elapsed);
		this.smoke.update(elapsed);
		this.fire.update(elapsed);
		this.leaf.update(elapsed);
		// this.controls.update(elapsed);

		parameter.global.blendLight = animations.getValue('blendLight', elapsed);
		parameter.global.blendLabelAlpha = animations.getValue('blendLabelAlpha', elapsed);
		parameter.global.blendLabelFire = animations.getValue('blendLabelFire', elapsed);
		var messageIndex = animations.getValue('messageIndex', elapsed);
		if (messageIndex != this.currentMessage) {

			// this.scene.remove( this.labels[this.currentMessage].mesh );
			this.currentMessage = messageIndex;
			material.label.uniforms.uTexture.value = this.labels[this.currentMessage];
			// this.scene.add( this.labels[this.currentMessage].mesh );
		}
		// this.updateMessage(elapsed);
		parameter.global.blendStorm = animations.getValue('blendStorm', elapsed);
		parameter.global.blendHeat = animations.getValue('blendHeat', elapsed);
		parameter.global.blendBurnOut = animations.getValue('blendBurnOut', elapsed);
		parameter.global.blendLeaf = animations.getValue('blendLeaf', elapsed);
		material.rain.uniforms.blendStorm.value = parameter.global.blendStorm;
		material.snow.uniforms.blendStorm.value = parameter.global.blendStorm;
		material.tree.uniforms.blendStorm.value = parameter.global.blendStorm;
		this.fire.uniforms.blendBurnOut.value = parameter.global.blendBurnOut;
		
		var cameraPos = animations.getPosition('camera', elapsed);
		this.camera.position.x = utils.lerp(this.camera.position.x, -cameraPos[0], .5);
		this.camera.position.y = utils.lerp(this.camera.position.y, cameraPos[2], .5);
		this.camera.position.z = utils.lerp(this.camera.position.z, cameraPos[1], .5);
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
			// material[this.parameterMap[i]].uniforms[this.parameterList[i]].value = parameter.show[this.parameterList[i]];
			material[this.parameterMap[i]].uniforms[this.parameterList[i]].value = animations.getValue(this.parameterList[i], elapsed);
		}
		for (var i = 0; i < this.globalParameter.length; ++i) {
			material.defaultUniforms[this.globalParameter[i]].value = parameter.global[this.globalParameter[i]];
		}
	}
}

