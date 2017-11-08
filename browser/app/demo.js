import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import BufferScene from './scene/BufferScene';
import RaymarchingScene from './scene/RaymarchingScene';
import PaperScene from './scene/PaperScene';
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import * as FX from "postprocessing"

export default function() {
	let frame;
	let filterScene, mainScene, bufferScene, raymarchingScene;
	let composer, pass, clock;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {
		frame = new FrameBuffer();
		bufferScene = new BufferScene();
		filterScene = new FilterScene();
		raymarchingScene = new RaymarchingScene();
		mainScene = new PaperScene();
		composer = new FX.EffectComposer(renderer);
		composer.addPass(new FX.RenderPass(mainScene.scene, mainScene.camera));
		let pass = new FX.BloomPass();
		pass.renderToScreen = true;
		composer.addPass(pass);
		clock = new THREE.Clock();

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

			composer.render(clock.getDelta());
			// renderer.render(mainScene.scene, mainScene.camera, frame.getTarget(), true);
			// uniforms.buffer.value = bufferScene.buffer.getTexture();
			// uniforms.frame.value = frame.getTexture();
			// bufferScene.update();
			// uniforms.frame.value = bufferScene.buffer.getTexture();
			// renderer.render(filterScene.scene, filterScene.camera);
		}
	}

	function onWindowResize () {
		mainScene.camera.aspect = window.innerWidth / window.innerHeight;
		mainScene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
