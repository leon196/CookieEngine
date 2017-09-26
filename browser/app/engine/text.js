
import * as THREE from 'three.js'
import { asset } from '../editor/asset'
import { material } from '../editor/material'

export function Text (message)
{
	this.geometry = new THREE.TextGeometry(message, {
		font: asset.font['helvetiker'],
		size: 1.,
		height: .01,
		curveSegments: 36,
	})
	this.geometry.computeBoundingBox();
	this.geometry.center();
	this.mesh = new THREE.Mesh( this.geometry, material.text );
}