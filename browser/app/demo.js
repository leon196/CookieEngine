
import * as THREE from 'three.js';
import { OrbitControls } from './libs/OrbitControls';
import assets from './engine/assets';
import renderer from './engine/renderer';
import parameters from './engine/parameters';
import { clamp, lerp, lerpArray, lerpVector, lerpVectorArray, saturate } from './engine/misc';
import Bloom from './libs/bloom/bloom';
import * as timeline from './engine/timeline';
import * as makeText from './engine/make-text';
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
	var scene, sceneEdge, camera, controls, animation, cameraPosition, cameraTarget;
	var frameFlat, frameEdge, passEdge, passRender, renderUniforms;
	var updates, frames;
	var timeElapsed, lastElapsed, delta, animDamping;
	var tree, ground, sky, starfield, grass, rain, text;

	assets.load(function() {
		scene = new THREE.Scene();
		sceneEdge = new THREE.Scene();
		
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 2000);
		camera.position.x = 0;
		camera.position.y = 2.5;
		camera.position.z = 5;
		cameraPosition = new THREE.Vector3();
		cameraTarget = new THREE.Vector3();

		frameFlat = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { type: THREE.FloatType });
		frameEdge = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { type: THREE.FloatType });
		passRender = new FrameBuffer({ count: 1, material: assets.shaders.postprocess });
		frames = [frameFlat, frameEdge, passRender];
		heightmap.init();
		heightmap.update();

		text = makeText.createTexture([{
			text: 'From Brain\nWith Love',
			font: 'bowlbyonesc',
			textAlign: 'center',
			fontSize: 150,
			fillStyle: 'white',
			textBaseline: 'middle',
			width: 1024,
			height: 1024,
			shadowColor: 'rgba(0,0,0,.5)',
			shadowBlur: 4,
			offsetY: -100,
		},{
			text: 'music by Grizzly Cogs\nart coded by ponk\ndev tool by Koltes',
			fontSize: 70,
			offsetY: 200,
		},
	]);

		renderUniforms = {
			time: { value: 0 },
			textVisible: { value: 1 },
			resolution: { value: [window.innerWidth, window.innerHeight] },
			frameFlat: { value: frameFlat.texture },
			frameText: { value: text },
			frameEdge: { value: frameEdge.texture },
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

		tree = new Tree();
		ground = new Ground();
		sky = new Sky();
		starfield = new Starfield();
		grass = new Grass();
		rain = new Rain();
		updates = [ tree, ground, sky ];
		updates.forEach(item => sceneEdge.add(item));
		updates.push(grass, rain, starfield);
		scene.add(grass, rain, starfield);
		// updates.push(heightmap);

		parameters.scene.leaves = 1;
		parameters.scene.froot = 1;
		parameters.scene.grass = 1;
		parameters.scene.text = 0;
		
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
	});

	function start () {
		requestAnimationFrame(animate);
		timeline.start();
		document.getElementById('overlay').remove();
		timeElapsed = 0.;
		lastElapsed = 0.;
	}

	function getVectorPosition (vector, name) {
		// var array = assets.animations.getPosition(name, timeElapsed);
		// return new THREE.Vector3(array[0], array[1], array[2]);
		return lerpVectorArray(vector, assets.animations.getPosition(name, timeElapsed), animDamping);
	}

	function getPosition (array, name) {
		// return assets.animations.getPosition(name, timeElapsed);
		return lerpArray(array, assets.animations.getPosition(name, timeElapsed), animDamping);
	}

	function getValue (value, name) {
		// return assets.animations.getValue(name, timeElapsed);
		return lerp(value, assets.animations.getValue(name, timeElapsed), animDamping);
	}

	function getValueClamped (value, name) {
		// return assets.animations.getValue(name, timeElapsed);
		return saturate(lerp(value, assets.animations.getValue(name, timeElapsed), animDamping));
	}

	function animate(elapsed) {
		requestAnimationFrame(animate);
		elapsed /= 1000.;

		if (parameters.other.animation) {
			delta = Math.max(.001, Math.abs(elapsed - lastElapsed));
			animDamping = clamp(10. * delta, 0.001, 1.);
			timeElapsed = timeline.getTime();

			cameraPosition = getVectorPosition(cameraPosition, "CameraAction");
			camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
			cameraTarget = getVectorPosition(cameraTarget, "CameraTargetAction");
			camera.lookAt(cameraTarget);
			camera.fov = getValue(camera.fov, "FOVAction");
			camera.updateProjectionMatrix();

			renderUniforms.textVisible.value = getValueClamped(renderUniforms.textVisible.value, "TextAction");
			tree.leavesUniforms.visible.value = getValueClamped(tree.leavesUniforms.visible.value, "LeavesAction");
			tree.leavesUniforms.bounce.value = getValueClamped(tree.leavesUniforms.bounce.value, "BounceAction");
			tree.leavesUniforms.twist.value = getValueClamped(tree.leavesUniforms.twist.value, "TwistAction");
			rain.uniforms.bounce.value = tree.leavesUniforms.bounce.value;
			rain.uniforms.twist.value = tree.leavesUniforms.twist.value;
			tree.frootUniforms.visible.value = getValueClamped(tree.frootUniforms.visible.value, "FrootAction");
			grass.uniforms.visible.value = getValueClamped(grass.uniforms.visible.value, "GrassAction");
			rain.uniforms.visible.value = getValueClamped(rain.uniforms.visible.value, "RainAction");
			rain.uniforms.stormIntensity.value = getValueClamped(rain.uniforms.stormIntensity.value, "StormAction");
			rain.uniforms.stormDirection.value = getPosition(rain.uniforms.stormDirection.value, "StormDirectionAction");

		} else {
			renderUniforms.textVisible.value = parameters.scene.text;
			tree.leavesUniforms.visible.value = parameters.scene.leaves;
			tree.frootUniforms.visible.value = parameters.scene.froot;
			grass.uniforms.visible.value = parameters.scene.grass;
			rain.uniforms.visible.value = parameters.scene.rain;
			timeElapsed = elapsed;
			controls.update();
		}

		updates.forEach(item => item.update(timeElapsed));

		renderUniforms.time.value = timeElapsed;
		renderer.render(scene, camera, frameFlat);
		renderer.render(sceneEdge, camera, frameEdge);
		renderer.render(passRender.scene, passRender.camera);

		lastElapsed = elapsed;
	}

	function onWindowResize () {
		var w = window.innerWidth / renderer.scale;
		var h = window.innerHeight / renderer.scale;
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderUniforms.resolution.value[0] = w;
		renderUniforms.resolution.value[1] = h;
		frames.forEach(item => item.setSize(w, h));
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
	}
}
