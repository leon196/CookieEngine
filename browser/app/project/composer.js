
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

var opticalFlow;

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

composer.setup = function () {

  var scenes = [
  	new Scene.CurvedMesh(),
    // new Scene.LineMesh(),
    // new Scene.PointCloud(),
    // new Scene.Ribbon(),
    // new Scene.Sprite(),
    // new Scene.Snow(),
  ];
  var scenesIndex = [];
  var gridIndex, opticalFlowIndex, feedbackIndex;

  composer.opticalFlow = new Scene.OpticalFlow();
  var opticalFrame = new FX.ShaderPass(assets.shaderMaterials.opticalFrame);
  composer.addPass(opticalFrame);
  savePass('lastFrameTexture');

  var keys = Object.keys(parameters.Scene);
  var index = 0;
  scenes.forEach(scene => {
		var pass = new FX.RenderPass(scene, camera, { clear: false });
		pass.enabled = parameters.Scene[keys[index]];
    scenesIndex.push(composer.passes.length);
		composer.addPass(pass);
    ++index;
  });
  savePass('sceneTexture');

  var feedback = new FX.ShaderPass(assets.shaderMaterials.feedback);
  feedbackIndex = composer.passes.length;
  composer.addPass(feedback);
  savePass('feedbackTexture', THREE.NearestFilter, THREE.NearestFilter);

	var pass = new FX.RenderPass(new Scene.GridMesh(), camera, { clear: false });
  gridIndex = composer.passes.length;
	composer.addPass(pass);
  savePass('gridTexture');

	var pass = new FX.RenderPass(composer.opticalFlow, camera, { clear: false });
  opticalFlowIndex = composer.passes.length;
	composer.addPass(pass);
  savePass('arrowTexture');

  var filter = new FX.ShaderPass(assets.shaderMaterials.filter);
  composer.addPass(filter);

  var bloom = new FX.BloomPass({
  	resolutionScale: 1.,
  	intensity: 1.0,
  	distinction: 1.0
  });
  bloom.renderToScreen = true;
  composer.addPass(bloom);

  composer.toggle = function (index, value) {
    if (index >= 0 && index <  scenesIndex.length) {
      composer.passes[scenesIndex[index]].enabled = value;
    }
    // if (index == 6) composer.passes[gridIndex].enabled = value;
  }

  var keys = Object.keys(parameters.Scene);
  var i = 0;
  keys.forEach(key => {
    composer.toggle(i, parameters.Scene[key]);
    ++i;
  });
}

export default composer;
