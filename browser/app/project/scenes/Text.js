
import * as THREE from 'three.js';
import * as makeText from '../../engine/make-text';
import assets from '../../engine/assets';
import Scene from '../../engine/scene';
import uniforms from '../../engine/uniforms';

export default class Text extends Scene {

	constructor() {
		super('textSceneTexture');

		var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1), assets.shaders.text);
		mesh.frustumCulled = false;
		this.add(mesh);

		this.currentSlide = 0;
		this.slides = [
			makeText.createTexture([{
				text: 'PAyNe',
				font: 'rhinos_rocksregular',
				textAlign: 'center',
				fontSize: 196,
				fillStyle: 'white',
				textAlign: 'center',
				textBaseline: 'middle',
				width: 512,
				height: 512,
				shadowColor: 'rgba(0,0,0,.5)',
				shadowBlur: 4,
				offsetY: -50,
			},{
				text: 'THe rADICALS SoUND',
				fontSize: 66,
				offsetY: 100,
			},{
				text: 'Benjamin Demotié\nDamien D. Richard',
				font: 'barlow',
				fontSize: 36,
				offsetY: 210,
			},{
				text: 'MUSIC',
				font: 'barlow',
				fontSize: 56,
				offsetY: -190,
			}]),
			makeText.createTexture([{
				text: 'VISUAL',
				font: 'barlow',
				textAlign: 'center',
				fontSize: 56,
				fillStyle: 'white',
				textAlign: 'center',
				textBaseline: 'middle',
				width: 512,
				height: 512,
				shadowColor: 'rgba(0,0,0,.5)',
				shadowBlur: 4,
				offsetY: -190,
			}])
		];
		uniforms.textTexture = { value: this.slides[this.currentSlide] };
	}

	update(time) {
		super.update(time);
		let slideIndex = assets.animations.getValue('SlideIndex', time);
		if (slideIndex != this.currentSlide) {
			this.currentSlide = slideIndex;
			uniforms.textTexture.value = this.slides[this.currentSlide];
		}
	}
}
