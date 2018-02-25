
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
		camera.position.x = .2;
		camera.position.y = 1;
		camera.position.z = 2;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		plant = new Plant();
		scene.add(plant);
		
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

		document.addEventListener('mousemove', Mouse.onMove);
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);

		var sub = 8;
		var count = 100;
		elapsed /= 1000.;

		plant.update(elapsed);

		controls.update();
		renderer.render(scene, camera);
	}

	function onWindowResize () {
		var w = window.innerWidth, h = window.innerHeight;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}
}
