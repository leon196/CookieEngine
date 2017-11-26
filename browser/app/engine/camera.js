
import * as THREE from 'three.js';
import parameters from '../project/parameters';
import uniforms from './uniforms';
import renderer from './renderer';
import assets from './assets';
import { OrbitControls } from '../libs/OrbitControls';
import { lerpArray } from './misc';

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 15;
camera.position.z = 30;

camera.controls = new OrbitControls( camera, renderer.domElement );
camera.controls.rotateSpeed = 0.1;
camera.controls.zoomSpeed = .5;
camera.controls.enableDamping = true;
camera.controls.dampingFactor = .09;

uniforms.cameraTarget = { value: [0,0,0] };
uniforms.cameraPos = { value: [0,0,0] };

let cameraPosition = [0,0,0];
let targetPosition = [0,0,0];

camera.setup = function() {
  cameraPosition = assets.animations.getPosition('Camera', 0);
  targetPosition = assets.animations.getPosition('LookAt', 0);
  camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
  camera.controls.target.set(targetPosition[0], targetPosition[1], targetPosition[2]);
}

camera.update = function(time) {
  // cameraPosition = lerpArray(cameraPosition, assets.animations.getPosition('Camera', time), .1);
  // targetPosition = lerpArray(targetPosition, assets.animations.getPosition('LookAt', time), .1);
  // camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
  // camera.controls.target.set(targetPosition[0], targetPosition[1], targetPosition[2]);

  camera.controls.update();
  uniforms.cameraPos.value = camera.position;
  uniforms.cameraTarget.value = camera.controls.target;
}

camera.ortho = new THREE.OrthographicCamera( -1, 1, -1, 1, -1, 1000 );


export default camera;
