import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import MainScene from './scene/MainScene';
import TunnelScene from './scene/TunnelScene';
import * as timeline from './engine/timeline';

export default function() {
	let frameScene, frameTunnel;
	let filterScene, mainScene, tunnelScene;
	let ready = false;

	requestAnimationFrame(animate);

	assets.load(function() {
		frameScene = new FrameBuffer();
		frameTunnel = new FrameBuffer();
		filterScene = new FilterScene();
		mainScene = new MainScene();
		tunnelScene = new TunnelScene();

		onWindowResize();
		window.addEventListener('resize', onWindowResize, false);

		timeline.start();
		ready = true;
	});

	function animate() {
		requestAnimationFrame(animate);

		if (ready) {
			const time = timeline.getTime();

			mainScene.update(time);
			tunnelScene.update(time);
			uniforms.time.value = time;

			renderer.render(mainScene.scene, mainScene.camera, frameScene.getTarget(), true);
			renderer.render(tunnelScene.scene, tunnelScene.camera, frameTunnel.getTarget(), true);
			assets.shaderMaterials.filter.uniforms.frameScene.value = frameScene.getTexture();
			assets.shaderMaterials.filter.uniforms.frameTunnel.value = frameTunnel.getTexture();
			assets.shaderMaterials.filter.uniforms.sceneOpacity.value = assets.animations.getValue('scene1Opacity', time);
			assets.shaderMaterials.filter.uniforms.tunnelOpacity.value = assets.animations.getValue('scene2Opacity', time);
			renderer.render(filterScene.scene, filterScene.camera);
		}
	}

	function onWindowResize () {
		mainScene.camera.aspect = window.innerWidth / window.innerHeight;
		mainScene.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
