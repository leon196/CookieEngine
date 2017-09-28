

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
import { State } from '../utils/State';
import { key } from '../utils/keyboard';
import { message } from '../editor/message';
import getTime from '../engine/getTime';

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

	this.fire = new Particle(treeAttributes, material.fire);
	
	this.currentMessage = 0;
	this.showMessage = false;
	this.hideMessage = false;
	this.labels = [];
	for (var i = 0; i < message.text.length; i++) {
		this.labels.push(new Text(message.text[i], material.label));
	}
	this.labelFireState = new State();
	this.messageStart = 0;

	this.scene.add( this.tree.mesh );
	this.scene.add( this.flash.mesh );
	this.scene.add( this.snow.mesh );
	this.scene.add( this.rain.mesh );
	this.scene.add( this.smoke.mesh );
	this.scene.add( this.fire.mesh );
	// this.scene.add( this.labels[this.currentMessage].mesh );

	this.globalParameter = Object.keys(parameter.global);
	for (var i = 0; i < this.globalParameter.length; ++i) {
		material.defaultUniforms[this.globalParameter[i]].value = parameter.global[this.globalParameter[i]];
	}

	material.rain.uniforms.blendStorm = { value: parameter.global.blendStorm };

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
		// this.controls.update(elapsed);

		// this.updateMessage(elapsed);
		parameter.global.blendStorm = animations.getValue('blendStorm', elapsed);
		material.rain.uniforms.blendStorm.value = parameter.global.blendStorm;
		material.snow.uniforms.blendStorm.value = parameter.global.blendStorm;
		material.tree.uniforms.blendStorm.value = parameter.global.blendStorm;
		
		var cameraPos = animations.getPosition('camera', elapsed);
		this.camera.position.x = utils.lerp(this.camera.position.x, -cameraPos[0], .5);
		this.camera.position.y = utils.lerp(this.camera.position.y, cameraPos[2], .5);
		this.camera.position.z = utils.lerp(this.camera.position.z, cameraPos[1], .5);
		this.camera.lookAt(new THREE.Vector3());
		var cameraRot = animations.getRotation('camera', elapsed);
		this.camera.rotation.x = (cameraRot[0] - Math.PI * 0.5);
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

	this.updateMessage = function (elapsed)
	{
		// if (this.currentMessage < message.timing.length) {
			if (this.showMessage == false) {
				if (elapsed >= message.timing[this.currentMessage]) {
					this.showMessage = true;
					this.messageStart = elapsed;
					this.nextMessageStep();
					console.log('start')
				}
			} else if (this.hideMessage == false) {
				if (this.messageStart + message.delay < elapsed) {
					console.log('next')
					this.nextMessageStep();
					this.hideMessage = true;
					// this.messageStart = elapsed;
					// this.showMessage = false;
				}
			}
		// }
		// if (key.space.down) {
		// 	key.space.down = false;
		// 	this.nextMessageStep();
		// }

		var dt = 0.016;
		switch (this.labelFireState.current) {
			// fade in
			case 0:
			parameter.global.blendLabelAlpha = 1.-this.labelFireState.ratio;
			this.labelFireState.update(dt);
			break;
			// idle
			case 1:
			this.labelFireState.update(1.);
			break;
			// burn
			case 2:
			parameter.global.blendLabelFire = this.labelFireState.ratio;
			this.labelFireState.update(dt);
			if (this.labelFireState.ratio == 1.) {
				this.nextMessageStep();
			}
			break;
		}
	}

	this.nextMessageStep = function ()
	{
		if (this.labelFireState.next < 2) {
			this.labelFireState.next = this.labelFireState.current+1;
		} else {
			this.labelFireState.set(0,0);
			parameter.global.blendLabelAlpha = 0;
			parameter.global.blendLabelFire = 0;
			this.scene.remove( this.labels[this.currentMessage].mesh );
			this.currentMessage += 1;
			this.scene.add( this.labels[this.currentMessage].mesh );
			this.showMessage = false;
			this.hideMessage = false;
					console.log('end')
		}
	}
}

