
import * as THREE from 'three.js';
import { lerp } from './engine/misc';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import Geometry from './engine/geometry';
import Mouse from './engine/mouse';
import Plant from './project/plant';

export default function() {
	var scene, camera, controls, plant;

	assets.load(function() {

		scene = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.x = .5;
		camera.position.y = 1.5;
		camera.position.z = 1;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		plant = new Plant();
		scene.add(plant);

		// assets.shaders.raymarch.uniforms.time = { value: 0 };
		// assets.shaders.raymarch.uniforms.resolution = { value: [0,0] };
		// scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1), assets.shaders.raymarch));
		
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

		document.addEventListener('mousemove', Mouse.onMove);
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);

		elapsed /= 1000.;

		plant.update(elapsed);

		// assets.shaders.raymarch.uniforms.time.value = elapsed;

		controls.update();
		renderer.render(scene, camera);
	}

	function onWindowResize () {
		var w = window.innerWidth/renderer.scale;
		var h = window.innerHeight/renderer.scale;
		// assets.shaders.raymarch.uniforms.resolution.value = [w, h];
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
