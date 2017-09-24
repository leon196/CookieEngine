import './style.css!';
import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three.js';

let camera, scene, renderer;
let mesh;

init();
animate();

function init() {
	camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;
	scene = new Scene();
	var geometry = new BoxBufferGeometry( 200, 200, 200 );
	var material = new MeshBasicMaterial({
		color: 0xFFFFFF,
	});
	mesh = new Mesh( geometry, material );
	scene.add( mesh );
	renderer = new WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;
	renderer.render( scene, camera );
}
