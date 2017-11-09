
import * as THREE from 'three.js';

const renderer = new THREE.WebGLRenderer({
	logarithmicDepthBuffer: true,
	antialias: false
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

export default renderer;
