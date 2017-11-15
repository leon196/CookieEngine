
import * as THREE from 'three.js';
import assets from './engine/assets';
import renderer from './engine/renderer';
import camera from './engine/camera';
import ShaderPass from './engine/shaderpass';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import parameters from './engine/parameters';
import * as timeline from './engine/timeline';
import ExamplesScene from './project/ExamplesScene';
import GridScreenScene from './project/GridScreenScene';

export default function() {
	let scenes, passes, uniformMaps;

	assets.load(function() {

		scenes = [
			new ExamplesScene(),
			new GridScreenScene()
		];

		passes = [
			new ShaderPass(assets.shaderMaterials.feedbackExample, 'loopback', 2),
			new ShaderPass(assets.shaderMaterials.filterExample, 'filter'),
		];

		uniformMaps = [];
		Object.keys(parameters).forEach(keyRoot => {
			Object.keys(parameters[keyRoot]).forEach(keyChild => {
				uniforms[keyRoot+keyChild] = { value: parameters[keyRoot][keyChild] };
				uniformMaps.push({ root:keyRoot, child:keyChild });
			});
		});

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		timeline.start();
	});

	function animate() {
		requestAnimationFrame(animate);
		const time = timeline.getTime();
		camera.update(time);
		uniforms.time.value = time;

		uniformMaps.forEach(parameter => {
			uniforms[parameter.root+parameter.child].value = parameters[parameter.root][parameter.child];
		})

		scenes.forEach(scene => scene.update(time));
		passes.forEach(pass => pass.update(time));
		renderer.render(passes[passes.length-1].scene, camera);
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		scenes.forEach(scene => scene.resize(w,h));
		passes.forEach(pass => pass.resize(w,h));
		renderer.setSize(w, h);
	}
}
