import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import MainScene from './scene/MainScene';
import * as timeline from './engine/timeline';

export default function() {
	let filterScene, mainScene;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {
		filterScene = new FilterScene(assets.shaderMaterials.filter);
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
			uniforms.frameScene.value = mainScene.getFrame();
			renderer.render(filterScene.scene, filterScene.camera);
		}
	}

	function onWindowResize () {
		mainScene.camera.aspect = window.innerWidth / window.innerHeight;
		mainScene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
