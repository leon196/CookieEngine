
import * as THREE from 'three.js';

const renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true,
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

export default renderer;
