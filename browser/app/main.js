import assets from './engine/assets';
import renderer from './engine/renderer';
import FrameBuffer from './engine/framebuffer';
import uniforms from './engine/uniforms';
import FilterScene from './scene/FilterScene';
import MainScene from './scene/MainScene';
import getTime from './engine/getTime';

let frame;
let filterScene, mainScene;
let ready = false;

requestAnimationFrame(animate);

assets.load(function() {
	frame = new FrameBuffer();
	filterScene = new FilterScene();
	mainScene = new MainScene();

	window.addEventListener('resize', onWindowResize, false);

	ready = true;
});

function animate() {
	requestAnimationFrame(animate);

	if (ready) {
		const time = getTime();

		mainScene.update(time);
		uniforms.time.value = time;

		renderer.render(mainScene.scene, mainScene.camera, frame.getTarget(), true);
		assets.shaderMaterials.filter.uniforms.frameBuffer.value = frame.getTexture();
		renderer.render(filterScene.scene, filterScene.camera);
	}
}

function onWindowResize () {
	mainScene.camera.aspect = window.innerWidth / window.innerHeight;
	mainScene.camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
