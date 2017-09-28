import './style.css!';

import * as THREE from 'three.js';
import './utils/utils';
import { asset } from './editor/asset';
import { material } from './editor/material';
import { renderer } from './engine/renderer';
import { key } from './utils/keyboard';
import { State } from './utils/state';
import { FrameBuffer } from './engine/framebuffer';
import { LoadingScene } from './scene/LoadingScene';
import { MainScene } from './scene/MainScene';
import { FilterScene } from './scene/FilterScene';
import getTime from './engine/getTime';

let frame, scene, sceneState;
let loadingScene, filterScene, mainScene;

init();
animate();

asset.load(function() {
	start();
	window.addEventListener('resize', onWindowResize, false);
});

function init ()
{
	loadingScene = new LoadingScene();
	sceneState = new State();
}

function start ()
{
	material.setup();
	frame = new FrameBuffer();
	filterScene = new FilterScene();
	mainScene = new MainScene();
  sceneState.next = 1;
}

function animate (elapsed)
{
	requestAnimationFrame(animate);
	elapsed = getTime();
	var dt = 0.016;

	sceneState.update(dt);

	switch (sceneState.current) {
		case 0: scene = loadingScene; break;
		case 1: scene = mainScene; break;
	}
	
	scene.update(elapsed);
	material.defaultUniforms.time.value = elapsed;

	if (sceneState.next != 0) {
		renderer.render(scene.scene, scene.camera, frame.getTarget(), true);
		material.filter.uniforms.fadeTransition.value = sceneState.ratio;
		material.filter.uniforms.frameBuffer.value = frame.getTexture();
		renderer.render(filterScene.scene, filterScene.camera);
	} else {
		renderer.render(scene.scene, scene.camera);
	}
}

function onWindowResize ()
{
	scene.camera.aspect = window.innerWidth / window.innerHeight;
	scene.camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
