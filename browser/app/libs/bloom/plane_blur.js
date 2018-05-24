
import * as THREE from 'three.js';
import assets from '../../engine/assets';

export default class PlaneBlur {
  constructor(texture, direction) {
    this.uniforms = null;
    this.texture = texture;
    this.direction = direction;
    this.mesh = this.createMesh();
  }
  createMesh() {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth / 10, window.innerHeight / 10),
      },
      direction: {
        type: 'v2',
        value: this.direction,
      },
      texture: {
        type: 't',
        value: this.texture,
      },
    };
    var material = assets.shaders.gaussianBlur.clone();
    assets.shaders.gaussianBlur.cloned.push(material);
    material.uniforms = this.uniforms;
    return new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
  }
  resize() {
    this.uniforms.resolution.value.set(window.innerWidth / 10, window.innerHeight / 10);
  }
}
