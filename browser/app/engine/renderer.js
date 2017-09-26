
import * as THREE from 'three.js';

export var renderer = new THREE.WebGLRenderer({
	antialias: true,
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );