import './style.css!';

import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three.js';
import './socket';
import './utils/utils';
import { Particle } from './engine/particle';
import { assets } from './utils/assets';

let camera, scene, renderer;
let mesh, particleTest;

assets.load(function() {
	init();
	animate();
});

function init() {
	camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 10;
	scene = new Scene();

	console.log(assets.geometries["vegetation"].attributes)
	particleTest = new Particle(assets.geometries["vegetation"].attributes);
	// particleTest = new Particle({
	// 	position: { array: [1,0,0] },
	// 	normal: { array: [0,1,0] },
	// 	color: { array: [1,1,1,1] },
	// });
	scene.add( particleTest.mesh );

	renderer = new WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	particleTest.mesh.rotation.x += 0.005;
	particleTest.mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}
