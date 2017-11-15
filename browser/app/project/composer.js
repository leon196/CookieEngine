
import * as THREE from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';
import camera from '../engine/camera';
import parameters from './parameters';
import * as FX from 'vanruesc/postprocessing';
import * as Scene from './scenes/AllScenes';

var composer = new FX.EffectComposer(renderer);

composer.setup = function () {

  var scenes = [
  	new Scene.CurvedMesh(),
    new Scene.LineMesh(),
    new Scene.GridMesh(),
    new Scene.PointCloud(),
    new Scene.Ribbon(),
    new Scene.Sprite(),
    new Scene.Snow(),
  ];

  var keys = Object.keys(parameters.Scene);
  var index = 0;
  scenes.forEach(scene => {
  		var pass = new FX.RenderPass(scene, camera, {
  			clear: false,
  		});
  		pass.renderToScreen = parameters.Scene[keys[index]];
  		composer.addPass(pass);
      ++index;
  });

  composer.toggle = function (index, value) {
    composer.passes[index].renderToScreen = value;
  }
}

export default composer;
