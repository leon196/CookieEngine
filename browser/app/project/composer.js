
import * as THREE from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';
import camera from '../engine/camera';
import parameters from './parameters';
import uniforms from '../engine/uniforms';
import * as FX from 'vanruesc/postprocessing';
import * as Scene from './scenes/AllScenes';

var composer = new FX.EffectComposer(renderer, {
  depthBuffer: true,
  stencilBuffer: true,
});

function savePass (uniformName, min, mag, type, format) {
  var save = new FX.SavePass();
  var clear = new FX.ClearPass();
  type = type || THREE.UnsignedByteType;
  format = format || THREE.RGBAFormat;
  min = min || THREE.LinearFilter;
  mag = mag || THREE.LinearFilter;
  save.renderTarget.texture.type = type;
  save.renderTarget.texture.format = format;
  save.renderTarget.texture.minFilter = min;
  save.renderTarget.texture.magFilter = mag;
  uniforms[uniformName] = { value: save.renderTarget.texture };
  composer.addPass(save);
  composer.addPass(clear);
}

composer.setup = function (scenes) {

  var keys = Object.keys(parameters.Scene);
  var index = 0;
  scenes.forEach(scene => {
		var pass = new FX.RenderPass(scene, camera, { clear: false });
		pass.enabled = parameters.Scene[keys[index]];
		composer.addPass(pass);
    ++index;
  });
  savePass('sceneTexture');

  var filter = new FX.ShaderPass(assets.shaderMaterials.filter);
  composer.addPass(filter);

  var bloom = new FX.BloomPass({
  	resolutionScale: 1.,
  	intensity: 1.0,
  	distinction: 1.0
  });
  bloom.renderToScreen = true;
  composer.addPass(bloom);
}

export default composer;
