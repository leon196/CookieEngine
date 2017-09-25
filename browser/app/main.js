import './style.css!';

import * as THREE from 'three.js';
import './utils/utils';
import { Particle } from './engine/particle';
import { assets } from './editor/assets';
import { OrbitControls } from './utils/OrbitControls';
import { materials } from './editor/materials';
import { renderer } from './engine/renderer';

let camera, scene, controls;
let mesh, particle;

assets.load(function() {
	init();
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
});

function init ()
{
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.z = 10;

	controls = new OrbitControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;

	scene = new THREE.Scene();
	materials.setup();

	particle = new Particle(assets.geometries["vegetation"].attributes);
	scene.add( particle.mesh );
}

function animate ()
{
	requestAnimationFrame( animate );

	controls.update();
	particle.update();
	renderer.render( scene, camera );
}

function onWindowResize ()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
