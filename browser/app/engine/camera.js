
import * as THREE from 'three.js';
import parameters from '../project/parameters';
import uniforms from './uniforms';
import renderer from './renderer';
import { OrbitControls } from '../libs/OrbitControls';

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 15;
camera.position.z = 30;

camera.controls = new OrbitControls( camera, renderer.domElement );
camera.controls.rotateSpeed = 0.1;
camera.controls.zoomSpeed = .5;
camera.controls.enableDamping = true;
camera.controls.dampingFactor = .09;

camera.update = function(time) {
  camera.controls.update();
}

export default camera;
