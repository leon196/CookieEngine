
import * as THREE from 'three.js'
import { assets } from '../editor/assets'
import { materials } from '../editor/materials'

export function Text (message)
{
	this.geometry = new THREE.TextGeometry(message, {
		font: assets.font['helvetiker'],
		size: 1.,
		height: .01,
		curveSegments: 36,
	})
	this.geometry.computeBoundingBox();
	this.geometry.center();
	this.mesh = new THREE.Mesh( this.geometry, materials.text );
}