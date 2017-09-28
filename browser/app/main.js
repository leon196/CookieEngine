import assets from './engine/assets';
import renderer from './engine/renderer';
import State from './engine/State';
import FrameBuffer from './engine/FrameBuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import LoadingScene from './scene/LoadingScene';
import MainScene from './scene/MainScene';
import getTime from './engine/getTime';

let frame, scene, sceneState;
let loadingScene, filterScene, mainScene;

init();
animate();

assets.load(function() {
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
	uniforms.time.value = elapsed;

	if (sceneState.next != 0) {
		renderer.render(scene.scene, scene.camera, frame.getTarget(), true);
		assets.shaderMaterials.filter.uniforms.fadeTransition.value = sceneState.ratio;
		assets.shaderMaterials.filter.uniforms.frameBuffer.value = frame.getTexture();
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
