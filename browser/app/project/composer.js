
import * as THREE from 'three.js';
import assets from '../engine/assets';
import renderer from '../engine/renderer';
import camera from '../engine/camera';
import parameters from '../engine/parameters';
import * as FX from 'vanruesc/postprocessing';
import * as Scene from './scenes/AllScenes';

var composer = new FX.EffectComposer(renderer);

composer.setup = function () {

  var scenes = [
  	new Scene.CurvedMesh(),
    new Scene.LineMesh(),
    // new Scene.GridMesh(),
    new Scene.PointCloud(),
    new Scene.Ribbon(),
    new Scene.Sprite(),
    new Scene.Snow(),
  ];

  scenes.forEach(scene => {
  		var render = new FX.RenderPass(scene, camera, {
  			clear: false,
  		});
  		render.renderToScreen = true;
  		composer.addPass(render);
  });
}

export default composer;
