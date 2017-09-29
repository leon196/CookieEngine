import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import LoadingScene from './scene/LoadingScene';
import MainScene from './scene/MainScene';
import getTime from './engine/getTime';

let frame, scene, music;
let loadingScene, filterScene, mainScene;
let timeStart, ready = false;

requestAnimationFrame(animate);

assets.load(function() {
	frame = new FrameBuffer();
	filterScene = new FilterScene();
	mainScene = new MainScene();
	loadingScene = new LoadingScene();
	music = document.getElementById("music");
	music.load();
	music.oncanplaythrough = function() {
		music.play();
		ready = true;
		timeStart = 0;
	};
	window.addEventListener('resize', onWindowResize, false);
});

function animate (elapsed)
{
	requestAnimationFrame(animate);
	// elapsed = getTime();
	if (ready) {
		elapsed = elapsed / 1000. - timeStart;
		mainScene.update(elapsed);
		uniforms.time.value = elapsed;
		renderer.render(mainScene.scene, mainScene.camera, frame.getTarget(), true);
		assets.shaderMaterials.filter.uniforms.frameBuffer.value = frame.getTexture();
		renderer.render(filterScene.scene, filterScene.camera);
	}	else {
		timeStart = elapsed / 1000.;
	}
}

function onWindowResize ()
{
	mainScene.camera.aspect = window.innerWidth / window.innerHeight;
	mainScene.camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
