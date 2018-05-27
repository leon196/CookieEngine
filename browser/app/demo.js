
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
import Grass from './project/grass';
import Rain from './project/rain';
import Starfield from './project/starfield';
import heightmap from './project/heightmap';

export default function() {
	var scene, sceneEdge, camera, controls, animation, cameraTarget;
	var frame, frameEdge, passEdge, passRender, bloom, renderUniforms;
	var updates, frames;

	assets.load(function() {

		scene = new THREE.Scene();
		sceneEdge = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.position.x = 0;
		camera.position.y = 2.5;
		camera.position.z = 5;
		cameraTarget = new THREE.Vector3();

		frame = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { type: THREE.FloatType });
		frameEdge = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { type: THREE.FloatType });
		passEdge = new FrameBuffer({ count: 1, material: assets.shaders.edge });
		passRender = new FrameBuffer({ count: 1, material: assets.shaders.postprocess });
		// bloom = new Bloom(passEdge.getTexture());
		frames = [frame, frameEdge, passEdge, passRender];
		heightmap.init();
		heightmap.update();

		renderUniforms = {
			time: { value: 0 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			passScene: { value: frame.texture },
			frameEdge: { value: frameEdge.texture },
			passEdge: { value: passEdge.getTexture() },
			// passBlur: { value: bloom.blurTarget.texture },
			// passBloom: { value: bloom.bloomTarget.texture },
			heightmap: { value: heightmap.texture },
			heightNormalMap: { value: heightmap.normalMap.texture },
			passRender: { value: passRender.getTexture() },
		};
		assets.shaders.edge.uniforms = renderUniforms;
		assets.shaders.blur.uniforms = renderUniforms;
		assets.shaders.postprocess.uniforms = renderUniforms;

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.5;
		controls.rotateSpeed = 0.25;

		var tree = new Tree();
		var ground = new Ground();
		var sky = new Sky();
		var starfield = new Starfield();
		var grass = new Grass();
		var rain = new Rain();
		updates = [ tree, ground, sky ];
		updates.forEach(item => sceneEdge.add(item));
		updates.push(grass, rain, starfield);
		scene.add(grass, rain, starfield);
		updates.push(heightmap);
		
		window.addEventListener('resize', onWindowResize, false);
		requestAnimationFrame(animate);
		onWindowResize();

		document.addEventListener('mousemove', Mouse.onMove);

		timeline.start();

		parameters.scene.leaves = 1;
		parameters.scene.grass = 1;
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
		renderer.render(sceneEdge, camera, frameEdge);
		passEdge.update();
		// bloom.render(renderer);
		renderer.render(passRender.scene, passRender.camera);
	}

	function onWindowResize () {
		var w = window.innerWidth;
		var h = window.innerHeight;
		renderer.setSize(w, h);
		renderUniforms.resolution.value[0] = w;
		renderUniforms.resolution.value[1] = h;
		frames.forEach(item => item.setSize(w, h));
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
		// bloom.resize();
	}
}
