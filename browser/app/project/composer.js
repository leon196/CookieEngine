
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

  var opticalFrame = new FX.ShaderPass(assets.shaderMaterials.opticalFrame);
  composer.addPass(opticalFrame);
  savePass('lastFrame');

  var keys = Object.keys(parameters.Scene);
  var index = 0;
  scenes.forEach(scene => {
  		var pass = new FX.RenderPass(scene, camera, { clear: false });
  		pass.enabled = parameters.Scene[keys[index]];
  		composer.addPass(pass);
      ++index;
  });
  savePass('sceneTexture');

	var pass = new FX.RenderPass(new Scene.GridMesh(), camera, { clear: false });
	composer.addPass(pass);
  savePass('gridTexture');

  var feedback = new FX.ShaderPass(assets.shaderMaterials.feedback);
  composer.addPass(feedback);
  savePass('feedbackTexture', THREE.UnsignedByteType, THREE.RGBAFormat, THREE.NearestFilter, THREE.NearestFilter);

  var opticalFlow = new FX.ShaderPass(assets.shaderMaterials.opticalFlow);
  composer.addPass(opticalFlow);
  savePass('opticalFlowTexture', THREE.FloatType);

  var filter = new FX.ShaderPass(assets.shaderMaterials.filter);
  filter.renderToScreen = true;
  composer.addPass(filter);

  composer.toggle = function (index, value) {
    composer.passes[index].enabled = value;
  }
}

export default composer;
