import assets from './engine/assets';
import renderer from './engine/renderer';
import ShaderPass from './engine/shaderpass';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import * as timeline from './engine/timeline';
import ExampleScene from './project/ExampleScene';

export default function() {
	let scene, frameBuffer, filter, feedback;

	assets.load(function() {
		scene = new ExampleScene();

		// Post FX
		frameBuffer = new FrameBuffer();
		feedback = new ShaderPass(assets.shaderMaterials.feedbackExample, 'loopback');
		filter = new ShaderPass(assets.shaderMaterials.filterExample, 'filter');
		uniforms.frameBuffer = { value: 0 };

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);

		timeline.start();
		requestAnimationFrame(animate);
	});

	function animate() {
		requestAnimationFrame(animate);
		const time = timeline.getTime();
		uniforms.time.value = time;
		scene.update(time);

			// Post FX
		uniforms.frameBuffer.value = frameBuffer.getTexture();
		frameBuffer.swap();
		renderer.render(scene.scene, scene.camera, frameBuffer.getRenderTarget(), true);
		feedback.update();

		// Render scene with FX
		renderer.render(filter.scene, filter.camera);
	}

	function onWindowResize () {
		scene.camera.aspect = window.innerWidth / window.innerHeight;
		scene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
