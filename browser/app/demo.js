
import * as THREE from 'three.js';
import { lerp } from './engine/misc';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import Mouse from './engine/mouse';

export default function() {
	var scene, camera, controls;

	assets.load(function() {

		scene = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.z = 10;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		var mesh = new THREE.Mesh(new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ));
		scene.add(mesh);
		
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

		document.addEventListener('mousemove', Mouse.onMove);
	});

	function animate() {
		requestAnimationFrame(animate);

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
