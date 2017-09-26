import './style.css!';

import * as THREE from 'three.js';
import './utils/utils';
import { Particle } from './engine/particle';
import { Line } from './engine/line';
import { assets } from './editor/assets';
import { OrbitControls } from './utils/OrbitControls';
import { materials } from './editor/materials';
import { renderer } from './engine/renderer';
import { makeText } from './utils/makeText';

let camera, scene, controls;
let particle, line;

assets.load(function() {
	init();
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
});

function init ()
{
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.z = 10;

	controls = new OrbitControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;

	scene = new THREE.Scene();
	materials.setup();
	particle = new Particle(assets.geometries["tree"].children[0].geometry.attributes);
	scene.add( particle.mesh );

	line = new Line(assets.geometries["branch"].children[0].geometry.attributes);
	scene.add( line.mesh );
	
	var textScale = .2;
  var loader = new THREE.FontLoader();
  loader.load(
			'assets/fonts/helvetiker_bold.typeface.json',
			function ( font ) {
			  var geometry = new THREE.TextGeometry("cookie demoparty 2017     jardin d'alice    december 8 & 9 2017    compo 8k demo wild     shader showdown    music and light show", {
		        font: font,
		        size: textScale,
		        height: .01,
		        curveSegments: 36,
		    })
				geometry.computeBoundingBox();
				var max = geometry.boundingBox.max;

				var xMid = - 0.5 * ( max.x - geometry.boundingBox.min.x );
				var yMid = - 0.5 * ( max.y - geometry.boundingBox.min.y );
				geometry.center();
			  var mesh = new THREE.Mesh( geometry, materials.text );
				scene.add( mesh );

				// geometry = new THREE.PlaneGeometry( max.x * 2., Math.abs(yMid)*2., 96, 1 );
				// var plane = new THREE.Mesh( geometry, materials.line );
				// scene.add( plane );
			}
		);

}

function animate ()
{
	requestAnimationFrame( animate );

	materials.text.uniforms.time.value += 0.016;
	controls.update();
	particle.update();
	line.update();
	renderer.render( scene, camera );
}

function onWindowResize ()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	particle.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
	line.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
}
