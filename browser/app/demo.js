
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import assets from './engine/assets';
import renderer from './engine/renderer';
import camera from './engine/camera';
import uniforms from './engine/uniforms';
import parameters from './project/parameters';
import composer from './project/composer';
import * as Scene from './project/scenes/AllScenes';

export default function() {
	let uniformMaps, clock;
	let particleSystem;

	assets.load(function() {
		uniforms.time.value = 0;
		uniformMaps = [];
		Object.keys(parameters).forEach(keyRoot => {
			Object.keys(parameters[keyRoot]).forEach(keyChild => {
				uniforms[keyRoot+keyChild] = { value: parameters[keyRoot][keyChild] };
				uniformMaps.push({ root:keyRoot, child:keyChild });
			});
		});

		particleSystem = new Scene.ParticleSystem();
	  var scenes = [
	  	particleSystem
	  ];

		composer.setup(scenes);
		timeline.start();

		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();
		clock = new THREE.Clock();
	});

	function animate() {
		requestAnimationFrame(animate);
		const time = timeline.getTime();

		uniforms.time.value = time;
		uniformMaps.forEach(parameter => {
			uniforms[parameter.root+parameter.child].value = parameters[parameter.root][parameter.child];
		})

		camera.update(time);
		particleSystem.update(time);
		composer.render(clock.getDelta());
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
		composer.setSize(w, h);
		uniforms.resolution.value = [window.innerWidth, window.innerHeight];
	}
}
