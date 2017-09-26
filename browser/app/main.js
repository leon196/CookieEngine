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
import { TestScene } from './scene/TestScene';

let camera, scene;
let particle, line, point, text;
let started = false;
let loadingScene, testScene;
let state;

init();
animate();

asset.load(function() {
	start();
	window.addEventListener( 'resize', onWindowResize, false );
});

function init ()
{
	loadingScene = new LoadingScene(scene);
	state = 0;
}

function start ()
{
	material.setup();
	testScene = new TestScene();
  state = 1;
}

function animate (elapsed)
{
	requestAnimationFrame( animate );
	elapsed /= 1000.;
	var dt = 0.016;

	switch (state) {
		case 0: scene = loadingScene; break;
		case 1: scene = testScene; break;
	}

	scene.update(elapsed);
	renderer.render( scene.scene, scene.camera );
}

function onWindowResize ()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	particle.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
	line.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
}
