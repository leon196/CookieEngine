import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import MainScene from './scene/MainScene';
import * as timeline from './engine/timeline';

export default function() {
	let mainScene;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {
		mainScene = new MainScene();

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);

		timeline.start();
		ready = true;
	});

	function animate() {
		requestAnimationFrame(animate);

		if (ready) {
			const time = timeline.getTime();
			mainScene.update(time);
			uniforms.time.value = time;
			renderer.render(mainScene.scene, mainScene.camera);
		}
	}

	function onWindowResize () {
		mainScene.camera.aspect = window.innerWidth / window.innerHeight;
		mainScene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
