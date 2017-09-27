

import * as THREE from 'three.js';
import { material } from '../editor/material'
import { asset } from '../editor/asset'
import { Particle } from '../engine/particle';
import { Line } from '../engine/line';
import { Point } from '../engine/point';
import { Text } from '../engine/text';
import { OrbitControls } from '../utils/OrbitControls';
import { renderer } from '../engine/renderer';

export function TreeScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	this.camera.position.y = 10;
	this.camera.position.z = 10;

	this.controls = new OrbitControls( this.camera, renderer.domElement );
	this.controls.rotateSpeed = 0.5;

	this.line = new Line(asset.geometry["tree"].children[0].geometry.attributes, material.tree);
	this.scene.add( this.line.mesh );
	
	var dimension = 512;
	material.snow.uniforms.dimension = { value: dimension };
	this.snow = new Point(dimension*dimension, material.snow);
	this.scene.add( this.snow.mesh );
	
	dimension = 64;
	material.rain.uniforms.dimension = { value: dimension };
	this.rain = new Point(dimension*dimension, material.rain);
	this.scene.add( this.rain.mesh );

	this.update = function (elapsed)
	{
		this.line.update(elapsed);
		this.snow.update(elapsed);
		this.rain.update(elapsed);
		this.controls.update(elapsed);
	}
}