
import * as THREE from 'three.js';
import assets from './engine/assets';
import renderer from './engine/renderer';
import camera from './engine/camera';
import uniforms from './engine/uniforms';
import parameters from './engine/parameters';
import * as timeline from './engine/timeline';
import * as FX from 'vanruesc/postprocessing';
import * as Scene from './project/AllScenes';

export default function() {
	let scenes, selectedScene, uniformMaps;
	let composer, passes, clock;

	assets.load(function() {

		selectedScene = 0;
		scenes = [
			new Scene.CurvedMesh(),
		  new Scene.LineMesh(),
		  // new Scene.GridMesh(),
		  new Scene.PointCloud(),
		  new Scene.Ribbon(),
		  new Scene.Sprite(),
		  new Scene.Snow(),
		];

		composer = new FX.EffectComposer(renderer);
		passes = [];
		scenes.forEach(scene => {
				var render = new FX.RenderPass(scene, camera, {
					clear: false,
				});
				render.renderToScreen = true;
				composer.addPass(render);
		});

		clock = new THREE.Clock();

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

		composer.render(clock.getDelta());
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}
}
