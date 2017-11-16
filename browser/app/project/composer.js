
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

function savePass (uniformName, type, format, min, mag) {
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
    new Scene.LineMesh(),
    new Scene.PointCloud(),
    new Scene.Ribbon(),
    new Scene.Sprite(),
    new Scene.Snow(),
  ];
  var scenesIndex = [];
  var gridIndex, opticalFlowIndex, feedbackIndex;

  var opticalFrame = new FX.ShaderPass(assets.shaderMaterials.opticalFrame);
  composer.addPass(opticalFrame);
  savePass('lastFrame');

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
  savePass('feedbackTexture', THREE.UnsignedByteType, THREE.RGBAFormat, THREE.NearestFilter, THREE.NearestFilter);

  var opticalFlow = new FX.ShaderPass(assets.shaderMaterials.opticalFlow);
  opticalFlowIndex = composer.passes.length;
  composer.addPass(opticalFlow);
  savePass('opticalFlowTexture', THREE.FloatType, THREE.RGBAFormat);

	var pass = new FX.RenderPass(new Scene.GridMesh(), camera, { clear: false });
  gridIndex = composer.passes.length;
	composer.addPass(pass);
  savePass('gridTexture');

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
    if (index == 6) composer.passes[feedbackIndex].enabled = value;
    if (index == 7) {
      composer.passes[opticalFlowIndex].enabled = value;
      composer.passes[gridIndex].enabled = value;
    }
  }

  var keys = Object.keys(parameters.Scene);
  var i = 0;
  keys.forEach(key => {
    composer.toggle(i, parameters.Scene[key]);
    ++i;
  });
}

export default composer;
