
import * as THREE from 'three.js';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import * as timeline from './engine/timeline';
import * as makeText from './engine/make-text';
import Mouse from './engine/mouse';
import FrameBuffer from './engine/framebuffer';
import Plant from './project/plant';
import { gui } from './engine/gui';

export default function() {
	var scene, camera, controls, plant;

	assets.load(function() {
		scene = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.position.x = 0;
		camera.position.y = 2.5;
		camera.position.z = 5;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		// plant = new Plant();
		// scene.add(plant);

		assets.shaders.raymarching.uniforms = {
			time: { value: 0 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			cameraPos: { value: camera.position },
			cameraTarget: { value: controls.target },
		}
		var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1), assets.shaders.raymarching);
		mesh.frustumCulled = false;
		scene.add(mesh);
		
		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		timeline.start();
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);
		elapsed /= 1000.;
		controls.update();
		// plant.update(elapsed);
		assets.shaders.raymarching.uniforms.time.value = elapsed;
		assets.shaders.raymarching.uniforms.cameraPos.value = camera.position;
		assets.shaders.raymarching.uniforms.cameraTarget.value = controls.target;
		renderer.render(scene, camera);
	}

	function onWindowResize () {
		var w = window.innerWidth / renderer.scale;
		var h = window.innerHeight / renderer.scale;
		renderer.setSize(window.innerWidth, window.innerHeight);
		assets.shaders.raymarching.uniforms.resolution.value[0] = w;
		assets.shaders.raymarching.uniforms.resolution.value[1] = h;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
	}
}
