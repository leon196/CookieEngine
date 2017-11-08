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
	let frame, frameRay;
	let filterScene, paperScene, bufferScene, rayScene;
	let composer, pass, clock;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {



		frame = new FrameBuffer(window.innerWidth, window.innerHeight, THREE.RGBAFormat, THREE.FloatType);
		frameRay = new FrameBuffer(window.innerWidth, window.innerHeight, THREE.RGBAFormat, THREE.FloatType);
		bufferScene = new BufferScene();
		filterScene = new FilterScene();
		rayScene = new RaymarchingScene();
		paperScene = new PaperScene();
		composer = new FX.EffectComposer(renderer);

		composer.addPass(new FX.RenderPass(filterScene.scene, filterScene.camera));

		// let imageSearch = new Image();
		// let imageArea = new Image();
		// imageSearch.src = FX.SMAAPass.searchImageDataUrl;
		// imageArea.src = FX.SMAAPass.areaImageDataUrl;
		// let smaapass = new FX.SMAAPass(imageSearch, imageArea);
		// smaapass.renderToScreen = true;
		// composer.addPass(smaapass);
		// let texturepass = new FX.TexturePass(smaapass.renderTargetColorEdges.texture);
		// texturepass.renderToScreen = true;
		// texturepass.enabled = false;
		// composer.addPass(texturepass);

		let bloom = new FX.BloomPass();
		bloom.renderToScreen = true;
		composer.addPass(bloom);

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

			paperScene.update(time);
			rayScene.update(time);
			uniforms.time.value = time;

			renderer.render(paperScene.scene, paperScene.camera, frame.getTarget(), true);
			renderer.render(rayScene.scene, rayScene.camera, frameRay.getTarget(), true);
			// uniforms.buffer.value = bufferScene.buffer.getTexture();
			uniforms.frame.value = frame.getTexture();
			uniforms.frameRay.value = frameRay.getTexture();
			// bufferScene.update();
			// uniforms.frame.value = bufferScene.buffer.getTexture();
			renderer.render(filterScene.scene, filterScene.camera);

			composer.render(clock.getDelta());
		}
	}

	function onWindowResize () {
		paperScene.camera.aspect = window.innerWidth / window.innerHeight;
		paperScene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
