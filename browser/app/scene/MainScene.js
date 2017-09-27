

import * as THREE from 'three.js';
import { material } from '../editor/material'
import { parameter } from '../editor/parameter'
import { asset } from '../editor/asset'
import { Particle } from '../engine/particle';
import { Line } from '../engine/line';
import { Point } from '../engine/point';
import { Text } from '../engine/text';
import { OrbitControls } from '../utils/OrbitControls';
import { renderer } from '../engine/renderer';

export function MainScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	this.camera.position.y = 30;
	this.camera.position.z = 30;

	this.controls = new OrbitControls( this.camera, renderer.domElement );
	this.controls.rotateSpeed = 0.5;

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

	this.scene.add( this.tree.mesh );
	this.scene.add( this.flash.mesh );
	this.scene.add( this.snow.mesh );
	this.scene.add( this.rain.mesh );
	this.scene.add( this.smoke.mesh );
	this.scene.add( this.fire.mesh );
	
	this.parameterList = Object.keys(parameter.show);
	this.parameterMap = []
	for (var i = 0; i < this.parameterList.length; ++i) {
		var name = this.parameterList[i].toLowerCase();
		name = name.slice(5, name.length);
		this.parameterMap.push(name);
		material[this.parameterMap[i]].uniforms[this.parameterList[i]] = { value: parameter.show[this.parameterList[i]] };
	}

	this.update = function (elapsed)
	{
		this.tree.update(elapsed);
		this.snow.update(elapsed);
		this.rain.update(elapsed);
		this.smoke.update(elapsed);
		this.fire.update(elapsed);
		this.controls.update(elapsed);
		for (var i = 0; i < this.parameterList.length; ++i) {
			material[this.parameterMap[i]].uniforms[this.parameterList[i]].value = parameter.show[this.parameterList[i]];
		}
	}
}