
import * as THREE from 'three.js';
import assets from '../../engine/assets';

export default class PlaneBright {
  constructor(texture) {
    this.uniforms = null;
    this.minBright = 0.2;
    this.texture = texture;
    this.mesh = this.createMesh();
  }
  createMesh() {
    this.uniforms = {
      minBright: {
        type: 'f',
        value: this.minBright,
      },
      texture: {
        type: 't',
        value: this.texture,
      }
    };
    var material = assets.shaders.bright.clone();
    assets.shaders.bright.cloned.push(material);
    material.uniforms = this.uniforms;
    return new THREE.Mesh( new THREE.PlaneBufferGeometry(2, 2), material );
  }
}
