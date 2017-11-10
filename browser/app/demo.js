import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import parameters from './engine/parameters';
import FilterScene from './scene/FilterScene';
import BufferScene from './scene/BufferScene';
import RaymarchingScene from './scene/RaymarchingScene';
import PaintScene from './scene/PaintScene';
import PaperScene from './scene/PaperScene';
import { clamp } from './libs/misc';
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import * as FX from "postprocessing"

export default function() {
	let frame, frameRay, framePaint;
	let frameArray, cameraArray;
	let filterScene, paperScene, bufferScene, rayScene, paintScene;
	let composer, pass, clock, composerPaint;
	let ready = false;
	let delayFPS = 1., lodRaymarch = 4., startToLag = 0.;
	let htmlText;

	requestAnimationFrame(animate);

	assets.load(function() {

		htmlText = document.getElementById('htmlText');
		var start = document.getElementById('start');
		start.innerHTML = 'start';
		start.addEventListener('click', function(e){
			ready = true;
		  start.innerHTML = '';

			Object.keys(parameters.show).forEach(key => {
				uniforms[key] = { value: parameters.show[key] };
			});

			var w = window.innerWidth;
			var h = window.innerHeight;
			frame = new FrameBuffer(w, h, THREE.RGBAFormat, THREE.FloatType);
			frameRay = new FrameBuffer(w/lodRaymarch, h/lodRaymarch, THREE.RGBAFormat, THREE.FloatType);
			framePaint = new FrameBuffer(w, h, THREE.RGBAFormat, THREE.FloatType);
			bufferScene = new BufferScene();
			filterScene = new FilterScene();
			rayScene = new RaymarchingScene();
			paintScene = new PaintScene();
			paperScene = new PaperScene();
			composer = new FX.EffectComposer(renderer);
			composer.addPass(new FX.RenderPass(filterScene.scene, filterScene.camera));
			cameraArray = [paintScene.camera, paperScene.camera];
			let bloom = new FX.BloomPass();
			bloom.renderToScreen = true;
			composer.addPass(bloom);
			clock = new THREE.Clock();
			onWindowResize();
			window.addEventListener('resize', onWindowResize, false);

			timeline.start();
		})
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);

		if (ready) {
			const time = timeline.getTime();
			// var time = elapsed / 1000.;
			var fps = 1./clock.getDelta();
			// htmlText.innerHTML = Math.floor(fps);
			if (fps < 30. && lodRaymarch < 8) {
				if (startToLag > time) {
					startToLag = time;
				}
				if (clamp((time-startToLag)/delayFPS, 0., 1.) >= 1.) {
					lodRaymarch *= 2.;
					startToLag += time + 10.;
					frameRay.resize(window.innerWidth/lodRaymarch,window.innerHeight/lodRaymarch);
				}
			} else if (fps > 60. && lodRaymarch > 1) {
				if (startToLag > time) {
					startToLag = time;
				}
				if (clamp((time-startToLag)/delayFPS, 0., 1.) >= 1.) {
					lodRaymarch /= 2.;
					startToLag += time + 10.;
					frameRay.resize(window.innerWidth/lodRaymarch,window.innerHeight/lodRaymarch);
				}
			} else {
				startToLag = time + 10.;
			}

			paperScene.update(time);
			rayScene.update(time);
			paintScene.update(time);
			uniforms.time.value = time;

			Object.keys(parameters.show).forEach(key => {
				// console.log(assets.animations);
				// gui parameters
				// uniforms[key].value = parameters.show[key];
				// blender animation parameters
				uniforms[key].value = assets.animations.getValue(key, time);
			});

			renderer.render(paperScene.scene, paperScene.camera, frame.getTarget(), true);
			renderer.render(rayScene.scene, paperScene.camera, frameRay.getTarget(), true);
			renderer.render(paintScene.scene, paintScene.camera, framePaint.getTarget(), true);
			// uniforms.buffer.value = bufferScene.buffer.getTexture();
			uniforms.frame.value = frame.getTexture();
			uniforms.frameRay.value = frameRay.getTexture();
			uniforms.framePaint.value = framePaint.getTexture();
			// bufferScene.update();
			// uniforms.frame.value = bufferScene.buffer.getTexture();
			renderer.render(filterScene.scene, filterScene.camera);

			composer.render(clock.getDelta());
		}
	}

	function onWindowResize () {
		var w = window.innerWidth;
		var h = window.innerHeight;
		for (var i = 0; i < cameraArray.length; ++i) {
			cameraArray[i].aspect = w / h;
			cameraArray[i].updateProjectionMatrix();
		}
		frame.resize(w,h);
		frameRay.resize(w/lodRaymarch,h/lodRaymarch);
		framePaint.resize(w,h);
		composer.readBuffer.setSize(w, h);
		composer.writeBuffer.setSize(w, h);
		uniforms.resolution.value = [w, h];
		renderer.setSize(w, h);
	}
}
