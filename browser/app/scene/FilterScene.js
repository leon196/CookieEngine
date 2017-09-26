

import * as THREE from 'three.js';
import { material } from '../editor/material'
import { asset } from '../editor/asset'

export function FilterScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );

	this.geometry = new THREE.PlaneGeometry(1,1,1);
	this.plane = new THREE.Mesh(this.geometry, material.filter);
	this.scene = this.plane;

	material.filter.uniforms.fadeTransition = { value: 0 };

	this.update = function (elapsed)
	{
	}
}