import './style.css!';

import * as THREE from 'three.js';
import './utils/utils';
import { asset } from './editor/asset';
import { material } from './editor/material';
import { renderer } from './engine/renderer';
import { key } from './utils/keyboard';
import { FrameBuffer } from './engine/FrameBuffer';
import { LoadingScene } from './scene/LoadingScene';
import { TestScene } from './scene/TestScene';
import { FilterScene } from './scene/FilterScene';
import { SnowScene } from './scene/SnowScene';
import { TreeScene } from './scene/TreeScene';

let scene, frame;
let started, state, stateNext, stateRatio;
let loadingScene, filterScene, testScene, snowScene, treeScene;

init();
animate();

asset.load(function() {
	start();
	window.addEventListener('resize', onWindowResize, false);
});

function init ()
{
	loadingScene = new LoadingScene();
	state = 0;
	stateNext = 0;
	stateRatio = 1;
	started = false;
}

function start ()
{
	material.setup();
	frame = new FrameBuffer();
	filterScene = new FilterScene();
	testScene = new TestScene();
	snowScene = new SnowScene();
	treeScene = new TreeScene();
  stateNext = 1;
	started = true;
}

function animate (elapsed)
{
	requestAnimationFrame(animate);
	elapsed /= 1000.;
	var dt = 0.016;

	updateState(dt);

	switch (state) {
		case 0: scene = loadingScene; break;
		case 1: scene = treeScene; break;
		case 2: scene = snowScene; break;
		case 3: scene = testScene; break;
	}
	
	scene.update(elapsed);
	material.defaultUniforms.time.value = elapsed;

	if (started) {
		renderer.render(scene.scene, scene.camera, frame.getTarget(), true);
		material.filter.uniforms.fadeTransition.value = stateRatio;
		material.filter.uniforms.frameBuffer.value = frame.getTexture();
		renderer.render(filterScene.scene, filterScene.camera);
	} else {
		renderer.render(scene.scene, scene.camera);
	}
}

function updateState (dt)
{
	if (state != stateNext) {
		if (stateRatio > 0.) {
			stateRatio -= dt;
		} else {
			state = stateNext;
		}
	} else {
		if (stateRatio < 1.) {
			stateRatio += dt;
		}
		// switch scene
		if (key.space.down) {
			stateNext = (stateNext + 1) % 4;
			key.space.down = false;
		}
	}

	stateRatio = Math.clamp(stateRatio, 0., 1.);
}

function onWindowResize ()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
