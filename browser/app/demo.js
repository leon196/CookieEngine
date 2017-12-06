
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import { lerp } from './engine/misc';
import assets from './engine/assets';
import renderer from './engine/renderer';
import camera from './engine/camera';
import uniforms from './engine/uniforms';
import parameters from './project/parameters';
import MainScene from './project/scenes/MainScene';
import Render from './project/render';
import Mouse from './engine/mouse';
import WebAudioAnalyser from './libs/web-audio-analyser'

export default function() {
	let scene, uniformMaps, render, audio, analyser, fft;
	let lastFrameTime, travelingSpeed;

	assets.load(function() {

	  // audio = new Audio();
	  // audio.src = 'asset/music/music.ogg';
	  // audio.play();
	  // analyser = new WebAudioAnalyser(audio);

		// fft = new THREE.DataTexture(analyser.frequencies(), 1024, 1, THREE.RGBFormat, THREE.FloatType);
		// fft.needsUpdate = true;
		// uniforms.fftTexture = { value: fft };

		scene = new MainScene();
		render = new Render();
		camera.setup();
		timeline.start();

		uniforms.time.value = 0;
		uniformMaps = [];
		Object.keys(parameters).forEach(keyRoot => {
			Object.keys(parameters[keyRoot]).forEach(keyChild => {
				uniforms[keyRoot+keyChild] = { value: parameters[keyRoot][keyChild] };
				uniformMaps.push({ root:keyRoot, child:keyChild });
			});
		});

		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

    document.addEventListener('mousemove', Mouse.onMove);
		uniforms.mouse = { value: [0,0] };

		uniforms.timeScaled = { value: 0 };
		lastFrameTime = 0;
		travelingSpeed = 0;
	});

	function animate() {
		requestAnimationFrame(animate);
		const time = timeline.getTime();
		let dt = time - lastFrameTime;

		uniforms.time.value = time;
		uniformMaps.forEach(parameter => {
			var name = parameter.root+parameter.child;
			// uniforms[name].value = assets.animations.getValue(name, time);
			uniforms[name].value = parameters[parameter.root][parameter.child];
		})

		// fft.image.data = analyser.frequencies();

		travelingSpeed += dt * assets.animations.getValue('TravelingSpeed', time)
		uniforms.timeScaled.value = lerp(uniforms.timeScaled.value, travelingSpeed, .1);

		uniforms.mouse.value[0] = lerp(uniforms.mouse.value[0], Mouse.x/window.innerWidth, .1);
		uniforms.mouse.value[1] = lerp(uniforms.mouse.value[1], Mouse.y/window.innerHeight, .1);

		camera.update(time);
		scene.update(time);
		render.update(time);
		renderer.render(render, camera);

		lastFrameTime = time;
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		scene.setSize(w, h);
		uniforms.resolution.value = [window.innerWidth, window.innerHeight];
	}
}
