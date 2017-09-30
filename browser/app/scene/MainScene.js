

import * as THREE from 'three.js';
import parameters from '../engine/parameters';
import { OrbitControls } from '../libs/OrbitControls';
import renderer from '../engine/renderer'
import assets from '../engine/assets';
import Particle from '../engine/particle';
import Line from '../engine/line';
import Point from '../engine/point';
import animations from '../engine/animations';
import State from '../engine/state';
import { simpleText } from '../engine/makeText';
import uniforms from '../engine/uniforms';
import message from '../../asset/message';
import { lerp, clamp } from '../libs/misc';

export default class {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 1000 );
		this.camera.position.y = 10;
		this.camera.position.z = 20;
		this.lookAt = new THREE.Vector3();
		this.lastElapsed = 0;


		var treeAttributes = assets.geometries.tree.children[0].geometry.attributes;
		var rootAttributes = assets.geometries.root.children[0].geometry.attributes;
		this.tree = new Line(treeAttributes, assets.shaderMaterials.tree);
		this.root = new Line(rootAttributes, assets.shaderMaterials.tree);
		this.fire = new Particle(treeAttributes, assets.shaderMaterials.fire, 1, true);
		this.leaf = new Particle(treeAttributes, assets.shaderMaterials.leaf);

		var textureTitle = new THREE.Texture(simpleText('CooKie\nDemopaRty', 'rhinos_rocksregular', 150, 1024, true));
		var textureDate = new THREE.Texture(simpleText('8, 9 December 2017', 'trashhand', 70, 1024, true));
		textureTitle.needsUpdate = true;
		textureDate.needsUpdate = true;
		assets.shaderMaterials.filter.uniforms.uTextureTitle = { value: textureTitle };
		assets.shaderMaterials.filter.uniforms.uTextureDate = { value: textureDate };

		assets.shaderMaterials.velocity.uniforms.blendHeat = { value: parameters.global.blendHeat };

		this.scene.add( this.tree.mesh );
		this.scene.add( this.fire.mesh );
		this.scene.add( this.root.mesh );
		this.scene.add( this.leaf.mesh );

		this.globalParameter = Object.keys(parameters.global);
		for (var i = 0; i < this.globalParameter.length; ++i) {
			uniforms[this.globalParameter[i]].value = parameters.global[this.globalParameter[i]];
		}

		var cameraPos = animations.getPosition('camera', 0);
		var lookAtPos = animations.getPosition('lookAt', 0);
		this.camera.position.x = -cameraPos[0];
		this.camera.position.y = cameraPos[2];
		this.camera.position.z = cameraPos[1];
		this.lookAt.x = -lookAtPos[0];
		this.lookAt.y = lookAtPos[2];
		this.lookAt.z = lookAtPos[1];
		this.camera.lookAt(this.lookAt);
		this.camera.updateMatrixWorld(true);

		this.controls = new OrbitControls( this.camera, renderer.domElement );
		this.controls.rotateSpeed = 0.5;
		this.controls.target = this.lookAt;
		this.controls.enablePan = false;
	}

	update(elapsed) 
	{
		var dt = clamp(Math.abs(elapsed - this.lastElapsed), 0., 1.);
		this.lastElapsed = elapsed;
		this.tree.update(elapsed);
		this.fire.update(elapsed);
		this.root.update(elapsed);
		this.leaf.update(elapsed);
		this.controls.update(elapsed);

		var wave = Math.sin(elapsed*.2)*.5+.5;
		assets.shaderMaterials.velocity.uniforms.blendHeat.value = wave;
		assets.shaderMaterials.filter.uniforms.blendHeat.value = wave;
		assets.shaderMaterials.leaf.uniforms.blendLeaf.value = 1.-wave;
	}
}

