
import { Mesh, PlaneGeometry } from 'three.js';
import { lerp } from '../../engine/misc';
import assets from '../../engine/assets';
import uniforms from '../../engine/uniforms';
import Scene from '../../engine/scene';

export default class Raymarch extends Scene {

	constructor() {
		super('raymarchTexture');

		this.raymarchSketches = [ 'raymarchRooms', 'raymarchStairs' ];
		this.currentSketch = 0;
		let shader = assets.shaders[this.raymarchSketches[this.currentSketch]];
		this.mesh = new Mesh(new PlaneGeometry(1,1,1), shader);
		this.mesh.frustumCulled = false;
    this.add(this.mesh);

		this.uniformNames = [ 'RoomMovement', 'StairMovement' ];
		this.valueBlend = {};
		this.blendRatio = .1;
		this.uniformNames.forEach(name => {
			let value = assets.animations.getValue(name, 0.);
			uniforms[name] = { value: value };
			this.valueBlend[name] = value;
		});
  }

	update(time) {
		super.update(time);
		this.uniformNames.forEach(name => {
			this.valueBlend[name] = lerp(this.valueBlend[name], assets.animations.getValue(name, time), this.blendRatio);
			uniforms[name].value = this.valueBlend[name];
		});

		let sketch = assets.animations.getValue('RaymarchSketch', time);
		if (sketch !== this.currentSketch) {
			this.currentSketch = sketch;
			this.mesh.material = assets.shaders[this.raymarchSketches[this.currentSketch]];
		}
	}
}
