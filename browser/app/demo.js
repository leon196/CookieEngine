
import * as THREE from 'three.js';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import * as timeline from './engine/timeline';
import Mouse from './engine/mouse';
import Tree from './project/tree';
import Ground from './project/ground';

export default function() {
	var scene, camera, controls, animation, cameraTarget;
	var tree, ground;

	assets.load(function() {

		scene = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.x = 0;
		camera.position.y = 2.5;
		camera.position.z = 5;

		cameraTarget = new THREE.Vector3();

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		tree = new Tree();
		ground = new Ground();
		scene.add(tree);
		scene.add(ground);
		
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

		document.addEventListener('mousemove', Mouse.onMove);

		timeline.start();
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);

		elapsed /= 1000.;
		// elapsed = timeline.getTime();

		// var animCameraPosition = assets.animations.getPosition("CameraAction", elapsed);
		// camera.position.set(animCameraPosition[0], animCameraPosition[1], animCameraPosition[2]);

		// var animCameraTarget = assets.animations.getPosition("CameraTargetAction", elapsed);
		// cameraTarget.set(animCameraTarget[0], animCameraTarget[1], animCameraTarget[2]);
		// camera.lookAt(cameraTarget);

		tree.update(elapsed);
		ground.update(elapsed);

		controls.update();
		renderer.render(scene, camera);
	}

	function onWindowResize () {
		var w = window.innerWidth/renderer.scale;
		var h = window.innerHeight/renderer.scale;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
