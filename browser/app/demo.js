
import * as THREE from 'three.js';
import * as timeline from './engine/timeline';
import assets from './engine/assets';
import renderer from './engine/renderer';
import camera from './engine/camera';
import uniforms from './engine/uniforms';
import parameters from './engine/parameters';
import composer from './project/composer';

export default function() {
	let scenes, selectedScene, uniformMaps, clock;

	assets.load(function() {

		clock = new THREE.Clock();
		composer.setup();

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

		composer.render(clock.getDelta());
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}
}
