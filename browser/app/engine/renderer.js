
import * as THREE from 'three.js';

const renderer = new THREE.WebGLRenderer({
	antialias: true,
});

renderer.setPixelRatio( window.devicePixelRatio );

export default renderer;
