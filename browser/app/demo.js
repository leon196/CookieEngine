
import * as THREE from 'three.js';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import Bloom from './libs/bloom/bloom';
import * as timeline from './engine/timeline';
import Mouse from './engine/mouse';
import FrameBuffer from './engine/framebuffer';
import Tree from './project/tree';
import Ground from './project/ground';
import Sky from './project/sky';
import Leaves from './project/leaves';
import Grass from './project/grass';
import heightmap from './project/heightmap';

export default function() {
	var scene, camera, controls, animation, cameraTarget;
	var frame, passEdge, passRender, bloom, renderUniforms;
	var updates;

	assets.load(function() {

		scene = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.x = 0;
		camera.position.y = 2.5;
		camera.position.z = 5;
		cameraTarget = new THREE.Vector3();

		frame = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
			type: THREE.FloatType,
		});
		passEdge = new FrameBuffer({ count: 1, material: assets.shaders.edge });
		passRender = new FrameBuffer({ count: 1, material: assets.shaders.postprocess });
		// bloom = new Bloom(frame.texture);
		bloom = new Bloom(passEdge.getTexture());
		heightmap.init();

		renderUniforms = {
			time: { value: 0 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			passScene: { value: frame.texture },
			passEdge: { value: passEdge.getTexture() },
			passBlur: { value: bloom.blurTarget.texture },
			passBloom: { value: bloom.bloomTarget.texture },
			heightmap: { value: heightmap.texture },
			passRender: { value: passRender.getTexture() },
		};
		assets.shaders.edge.uniforms = renderUniforms;
		assets.shaders.blur.uniforms = renderUniforms;
		assets.shaders.postprocess.uniforms = renderUniforms;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		updates = [
			new Tree(),
			new Ground(),
			new Sky(),
			new Leaves(),
			// new Grass(),
		];
		updates.forEach(item => scene.add(item));
		updates.push(heightmap);
		
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

		document.addEventListener('mousemove', Mouse.onMove);

		timeline.start();
	});

	function animate(elapsed) {
		requestAnimationFrame(animate);
		elapsed /= 1000.;
		controls.update();
		// elapsed = timeline.getTime();

		// var animCameraPosition = assets.animations.getPosition("CameraAction", elapsed);
		// camera.position.set(animCameraPosition[0], animCameraPosition[1], animCameraPosition[2]);

		// var animCameraTarget = assets.animations.getPosition("CameraTargetAction", elapsed);
		// cameraTarget.set(animCameraTarget[0], animCameraTarget[1], animCameraTarget[2]);
		// camera.lookAt(cameraTarget);

		updates.forEach(item => item.update(elapsed));

		renderUniforms.time.value = elapsed;
		renderer.render(scene, camera, frame);
		passEdge.update();
  	bloom.render(renderer);
		renderer.render(passRender.scene, passRender.camera);
	}

	function onWindowResize () {
		var w = window.innerWidth/renderer.scale;
		var h = window.innerHeight/renderer.scale;
		renderUniforms.resolution.value[0] = w;
		renderUniforms.resolution.value[1] = h;
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		bloom.resize();
	}
}
