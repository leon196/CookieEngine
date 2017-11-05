import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import BufferScene from './scene/BufferScene';
import RaymarchingScene from './scene/RaymarchingScene';
import SputnikScene from './scene/SputnikScene';
import * as timeline from './engine/timeline';

export default function() {
	let frame;
	let filterScene, mainScene, bufferScene, raymarchingScene;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {
		frame = new FrameBuffer();
		bufferScene = new BufferScene();
		filterScene = new FilterScene();
		raymarchingScene = new RaymarchingScene();
		mainScene = new SputnikScene();

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);

		timeline.start();
		ready = true;
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);

		if (ready) {
			// const time = timeline.getTime();
			var time = elapsed / 1000.;

			mainScene.update(time);
			uniforms.time.value = time;

			// raymarchingScene.update(time);
			// renderer.render(mainScene.scene, mainScene.camera, frame.getTarget(), true);
			// uniforms.buffer.value = bufferScene.buffer.getTexture();
			// uniforms.frame.value = frame.getTexture();
			// bufferScene.update();
			// uniforms.frame.value = bufferScene.buffer.getTexture();
			// renderer.render(filterScene.scene, filterScene.camera);
			renderer.render(raymarchingScene.scene, raymarchingScene.camera);
		}
	}

	function onWindowResize () {
		mainScene.camera.aspect = window.innerWidth / window.innerHeight;
		mainScene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
