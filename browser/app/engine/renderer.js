
import * as THREE from 'three.js';

var renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true,
});
renderer.scale = 1.;
renderer.setPixelRatio( window.devicePixelRatio / renderer.scale );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

export default renderer;
