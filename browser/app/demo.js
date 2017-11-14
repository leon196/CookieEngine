import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import * as timeline from './engine/timeline';
import ExampleScene from './project/ExampleScene';

export default function() {
	let scene;

	assets.load(function() {
		scene = new ExampleScene();

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);

		timeline.start();
		requestAnimationFrame(animate);
	});

	function animate() {
		requestAnimationFrame(animate);

		const time = timeline.getTime();
		scene.update(time);
		uniforms.time.value = time;
		renderer.render(scene.filter.scene, scene.filter.camera);
	}

	function onWindowResize () {
		scene.camera.aspect = window.innerWidth / window.innerHeight;
		scene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
