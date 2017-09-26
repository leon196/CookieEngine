import './style.css!';

import * as THREE from 'three.js';
import './utils/utils';
import { Particle } from './engine/particle';
import { Line } from './engine/line';
import { Point } from './engine/point';
import { Text } from './engine/text';
import { asset } from './editor/asset';
import { OrbitControls } from './utils/OrbitControls';
import { material } from './editor/material';
import { renderer } from './engine/renderer';
import { makeText } from './utils/makeText';
import { LoadingScene } from './scene/LoadingScene';

let camera, scene, controls;
let particle, line, point, text;
let started = false;
let loadingScene;
let state;

init();
animate();

asset.load(function() {
	start();
	window.addEventListener( 'resize', onWindowResize, false );
});

function init ()
{
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.y = 10;
	camera.position.z = 20;

	controls = new OrbitControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;

	loadingScene = new LoadingScene(scene);

	state = 0;
}

function start ()
{
	material.setup();

	particle = new Particle(asset.geometry["tree"].children[0].geometry.attributes);
	scene.add( particle.mesh );

	point = new Point(256*256, material.point);
	scene.add( point.mesh );

	line = new Line(asset.geometry["tree"].children[0].geometry.attributes);
	scene.add( line.mesh );
	
	var textScale = .2;
	text = new Text("coucou");
	scene.add (text.mesh);

  state = 1;
}

function animate (elapsed)
{
	requestAnimationFrame( animate );
	elapsed /= 1000.;
	var dt = 0.016;

	switch (state) {
		case 0:
		loadingScene.update(elapsed);
		break;
		case 1:
		material.text.uniforms.time.value = elapsed;
		particle.update(elapsed);
		line.update(elapsed);
		break;
	}

	controls.update();
	renderer.render( scene, camera );
}

function onWindowResize ()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	particle.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
	line.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
}
