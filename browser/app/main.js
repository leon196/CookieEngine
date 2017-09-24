import './style.css!';

import * as THREE from 'three.js';
import './socket';
import './utils/utils';
import { Particle } from './engine/particle';
import { assets } from './utils/assets';
import { OrbitControls } from './utils/OrbitControls';

let camera, scene, renderer, controls;
let mesh, particleTest;

assets.load(function() {
	init();
	animate();
});

function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.z = 10;

	controls = new OrbitControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;

	scene = new THREE.Scene();

	console.log(assets.geometries["vegetation"].attributes)
	particleTest = new Particle(assets.geometries["vegetation"].attributes);
	// particleTest = new Particle({
	// 	position: { array: [1,0,0] },
	// 	normal: { array: [0,1,0] },
	// 	color: { array: [1,1,1,1] },
	// });
	scene.add( particleTest.mesh );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );

	controls.update();
	// particleTest.mesh.rotation.x += 0.005;
	// particleTest.mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}
