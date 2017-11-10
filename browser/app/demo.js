import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import parameters from './engine/parameters';
import FilterScene from './scene/FilterScene';
import RaymarchingScene from './scene/RaymarchingScene';
import TextScene from './scene/TextScene';
import MainScene from './scene/MainScene';
import { clamp } from './libs/misc';
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import * as FX from "postprocessing"

export default function() {
	let frameScene, frameRaymarch, frameText;
	let cameraArray;
	let filterScene, mainScene, rayScene, textScene;
	let composer, pass, clock;
	let time = 0;
	let delayFPS = 1., lodRaymarch = 4., startToLag = 0.;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {

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
			frameScene = new FrameBuffer(w, h, THREE.RGBAFormat, THREE.FloatType);
			frameRaymarch = new FrameBuffer(w/lodRaymarch, h/lodRaymarch, THREE.RGBAFormat, THREE.FloatType);
			frameText = new FrameBuffer(w, h, THREE.RGBAFormat, THREE.FloatType);
			filterScene = new FilterScene();
			rayScene = new RaymarchingScene();
			textScene = new TextScene();
			mainScene = new MainScene();
			composer = new FX.EffectComposer(renderer);
			composer.addPass(new FX.RenderPass(filterScene.scene, filterScene.camera));
			cameraArray = [textScene.camera, mainScene.camera];
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
			time = timeline.getTime();

			checkFrameRate();

			mainScene.update(time);
			rayScene.update(time);
			textScene.update(time);
			uniforms.time.value = time;

			Object.keys(parameters.show).forEach(key => {
				// gui parameters
				// uniforms[key].value = parameters.show[key];
				// blender animation parameters
				uniforms[key].value = assets.animations.getValue(key, time);
			});

			// render to textures
			renderer.render(mainScene.scene, mainScene.camera, frameScene.getTarget(), true);
			renderer.render(rayScene.scene, mainScene.camera, frameRaymarch.getTarget(), true);
			renderer.render(textScene.scene, textScene.camera, frameText.getTarget(), true);

			// update textures
			uniforms.frameScene.value = frameScene.getTexture();
			uniforms.frameRaymarch.value = frameRaymarch.getTexture();
			uniforms.frameText.value = frameText.getTexture();

			// custom post fx
			renderer.render(filterScene.scene, filterScene.camera);

			// post processing
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
		frameScene.resize(w,h);
		frameRaymarch.resize(w/lodRaymarch,h/lodRaymarch);
		frameText.resize(w,h);
		composer.readBuffer.setSize(w, h);
		composer.writeBuffer.setSize(w, h);
		uniforms.resolution.value = [w, h];
		renderer.setSize(w, h);
	}

	function checkFrameRate () {
		var fps = 1./clock.getDelta();
		if (fps < 30. && lodRaymarch < 8) {
			if (startToLag > time) {
				startToLag = time;
			}
			if (clamp((time-startToLag)/delayFPS, 0., 1.) >= 1.) {
				lodRaymarch *= 2.;
				startToLag += time + 10.;
				frameRaymarch.resize(window.innerWidth/lodRaymarch,window.innerHeight/lodRaymarch);
			}
		} else if (fps > 60. && lodRaymarch > 1) {
			if (startToLag > time) {
				startToLag = time;
			}
			if (clamp((time-startToLag)/delayFPS, 0., 1.) >= 1.) {
				lodRaymarch /= 2.;
				startToLag += time + 10.;
				frameRaymarch.resize(window.innerWidth/lodRaymarch,window.innerHeight/lodRaymarch);
			}
		} else {
			startToLag = time + 10.;
		}
	}
}
