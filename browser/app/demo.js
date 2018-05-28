
import * as THREE from 'three.js';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import { lerp, lerpArray, lerpVector, lerpVectorArray } from './engine/misc';
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
import text from './project/text';

export default function() {
	var scene, sceneEdge, camera, controls, animation, cameraPosition, cameraTarget;
	var frameFlat, frameEdge, passEdge, passRender, bloom, renderUniforms;
	var updates, frames;
	var timeElapsed, lastElapsed;

	assets.load(function() {
		scene = new THREE.Scene();
		sceneEdge = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.position.x = 0;
		camera.position.y = 2.5;
		camera.position.z = 5;
		cameraPosition = new THREE.Vector3(.001,.001,.001);
		cameraTarget = new THREE.Vector3(.001,.001,.001);

		frameFlat = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { type: THREE.FloatType });
		frameEdge = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { type: THREE.FloatType });
		passEdge = new FrameBuffer({ count: 1, material: assets.shaders.edge });
		passRender = new FrameBuffer({ count: 1, material: assets.shaders.postprocess });
		frames = [frameFlat, frameEdge, passEdge, passRender];
		heightmap.init();
		heightmap.update();

		renderUniforms = {
			time: { value: 0 },
			textVisible: { value: 1 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			frameFlat: { value: frameFlat.texture },
			frameEdge: { value: frameEdge.texture },
			frameText: { value: text },
			passEdge: { value: passEdge.getTexture() },
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
		// updates.push(heightmap);

		parameters.scene.leaves = 1;
		parameters.scene.froot = 1;
		parameters.scene.grass = 1;
		parameters.scene.text = 1;
		
		window.addEventListener('resize', onWindowResize, false);
		onWindowResize();
		document.addEventListener('mousemove', Mouse.onMove);

		var info = document.getElementById('info');
		info.innerHTML = '';
		var startButton = document.createElement('input');
		startButton.type = 'button';
		startButton.value = 'start';
		startButton.onclick = start;
		info.appendChild(startButton);
		start();
	});

	function start () {
		requestAnimationFrame(animate);
		timeline.start();
		document.getElementById('overlay').remove();
		timeElapsed = 0.;
		lastElapsed = 0.;
	}

	function animate(elapsed) {
		requestAnimationFrame(animate);

		elapsed /= 1000.;
		controls.update();

		var delta = Math.max(.001, Math.abs(elapsed - lastElapsed));
		lastElapsed = elapsed;
		var animDamping = 10. * delta;

		// timeElapsed = lerp(timeElapsed, timeline.getTime(), animDamping);
		timeElapsed = timeline.getTime();

		cameraPosition = lerpVectorArray(cameraPosition, assets.animations.getPosition("CameraAction", timeElapsed), animDamping);
		camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

		cameraTarget = lerpVectorArray(cameraTarget, assets.animations.getPosition("CameraTargetAction", timeElapsed), animDamping);
		camera.lookAt(cameraTarget);

		// renderUniforms.textVisible.value = parameters.scene.text;
		renderUniforms.textVisible.value = lerp(renderUniforms.textVisible.value, assets.animations.getValue("TextAction", timeElapsed), animDamping);

		updates.forEach(item => item.update(timeElapsed));

		renderUniforms.time.value = timeElapsed;
		renderer.render(scene, camera, frameFlat);
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
	}
}
