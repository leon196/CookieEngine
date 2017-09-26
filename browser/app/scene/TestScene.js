

import * as THREE from 'three.js';
import { material } from '../editor/material'
import { asset } from '../editor/asset'
import { Particle } from '../engine/particle';
import { Line } from '../engine/line';
import { Point } from '../engine/point';
import { Text } from '../engine/text';
import { OrbitControls } from '../utils/OrbitControls';
import { renderer } from '../engine/renderer';

export function TestScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	this.camera.position.z = 5;

	this.controls = new OrbitControls( this.camera, renderer.domElement );
	this.controls.rotateSpeed = 0.5;

	this.particle = new Particle(asset.geometry["tree"].children[0].geometry.attributes);
	this.point = new Point(256*256, material.point);
	this.line = new Line(asset.geometry["tree"].children[0].geometry.attributes);
	this.text = new Text("coucou");

	this.scene.add( this.particle.mesh );
	this.scene.add( this.point.mesh );
	this.scene.add( this.line.mesh );
	this.scene.add (this.text.mesh);

	this.update = function (elapsed)
	{
		material.text.uniforms.time.value = elapsed;
		this.particle.update(elapsed);
		this.point.update(elapsed);
		this.line.update(elapsed);
		this.text.update(elapsed);
		this.controls.update(elapsed);
	}
}