

import * as THREE from 'three.js';
import { material } from '../editor/material'
import { asset } from '../editor/asset'
import { Particle } from '../engine/particle';
import { Line } from '../engine/line';
import { Point } from '../engine/point';
import { Text } from '../engine/text';
import { OrbitControls } from '../utils/OrbitControls';
import { renderer } from '../engine/renderer';

export function SnowScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	this.camera.position.y = 10;
	this.camera.position.z = 10;

	this.controls = new OrbitControls( this.camera, renderer.domElement );
	this.controls.rotateSpeed = 0.5;

	this.point = new Point(256*256, material.point);

	this.scene.add( this.point.mesh );

	this.update = function (elapsed)
	{
		this.point.update(elapsed);
		this.controls.update(elapsed);
	}
}