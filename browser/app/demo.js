
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import { lerp } from './engine/misc';
import assets from './engine/assets';
import renderer from './engine/renderer';
import camera from './engine/camera';
import uniforms from './engine/uniforms';
import parameters from './project/parameters';
import Render from './project/render';
import Mouse from './engine/mouse';
import Fire from './project/scenes/Fire';
import Paper from './project/scenes/Paper';
import Raymarch from './project/scenes/Raymarch';

export default function() {
	let scenes, uniformMaps, render;

	assets.load(function() {

	  scenes = [
	  	// new Fire(),
	  	new Paper(),
	  	new Raymarch(),
	  ];


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
	});

	function animate() {
		requestAnimationFrame(animate);
		const time = timeline.getTime();

		uniforms.time.value = time;
		uniformMaps.forEach(parameter => {
			var name = parameter.root+parameter.child;
			// uniforms[name].value = assets.animations.getValue(name, time);
			uniforms[name].value = parameters[parameter.root][parameter.child];
		})

		uniforms.mouse.value[0] = lerp(uniforms.mouse.value[0], Mouse.x/window.innerWidth, .1);
		uniforms.mouse.value[1] = lerp(uniforms.mouse.value[1], Mouse.y/window.innerHeight, .1);

		camera.update(time);
		scenes.forEach(scene => {
			scene.update(time);
		})
		render.update(time);
		renderer.render(render, camera);
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		scenes.forEach(scene => {
			scene.setSize(w, h);
		})
		uniforms.resolution.value = [window.innerWidth, window.innerHeight];
	}
}
