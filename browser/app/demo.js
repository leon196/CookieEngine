import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import MainScene from './scene/MainScene';
import * as timeline from './engine/timeline';

export default function() {
	let frame;
	let filterScene, mainScene;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {
		frame = new FrameBuffer();
		filterScene = new FilterScene();
		mainScene = new MainScene();

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);

		document.getElementById('tree').appendChild(renderer.domElement);
		document.getElementById('header').remove();

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

			renderer.render(mainScene.scene, mainScene.camera, frame.getTarget(), true);
			assets.shaderMaterials.filter.uniforms.frameBuffer.value = frame.getTexture();
			renderer.render(filterScene.scene, filterScene.camera);
		}
	}

	function onWindowResize () {
		const width = document.documentElement.clientWidth;
		const height = document.documentElement.clientHeight * .7;
		mainScene.camera.aspect = width / height;
		mainScene.camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}
}
