
import * as THREE from 'three.js';
import assets from '../../engine/assets';

export default class PlaneBloom {
  constructor(tex_base, tex_blur) {
    this.uniforms = null;
    this.tone = 0.7;
    this.strength = 3;
    this.texBase = tex_base;
    this.texBlur = tex_blur;
    this.mesh = this.createMesh();
  }
  createMesh() {
    this.uniforms = {
      tone: {
        type: 'f',
        value: this.tone,
      },
      strength: {
        type: 'f',
        value: this.strength,
      },
      texBase: {
        type: 't',
        value: this.texBase,
      },
      texBlur: {
        type: 't',
        value: this.texBlur,
      }
    };
    var material = assets.shaders.bloom.clone();
    assets.shaders.bloom.cloned.push(material);
    material.uniforms = this.uniforms;
    return new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
  }
}
