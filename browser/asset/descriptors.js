import * as THREE from 'three.js';

export default {
	fonts: {
		coffee: {
			file: 'font/coffee.json',
		},
		helvetiker: {
			file: 'font/helvetiker_bold.typeface.json',
		},
		Kanit: {
			file: 'font/Kanit_Bold.json',
		},
	},
	geometries: {
		branch: {
			file: 'point/branch.obj',
		},
		flash: {
			file: 'point/flash.obj',
		},
		tree: {
			file: 'point/tree.obj',
		},
	},
	shaderMaterials: {
		flash: {
			vertexShader: 'shader/scene/flash.vert',
			fragmentShader: 'shader/scene/flash.frag',
			side: THREE.DoubleSide,
			depthTest: false,
			opacity: .5,
			transparent: true,
		},
		filter: {
			vertexShader: 'shader/filter/screen.vert',
			fragmentShader: 'shader/filter/filter.frag',
		},
		fire: {
			vertexShader: 'shader/scene/fire.vert',
			fragmentShader: 'shader/scene/fire.frag',
			side: THREE.DoubleSide,
			depthTest: false,
			opacity: .5,
			transparent: true,
		},
		label: {
			vertexShader: 'shader/scene/label.vert',
			fragmentShader: 'shader/scene/label.frag',
			side: THREE.DoubleSide,
			depthTest: false,
			opacity: .5,
			transparent: true,
		},
		line: {
			vertexShader: 'shader/triangle/line.vert',
			fragmentShader: 'shader/triangle/line.frag',
			side: THREE.DoubleSide,
		},
		particle: {
			vertexShader: 'shader/triangle/particle.vert',
			fragmentShader: 'shader/triangle/particle.frag',
			side: THREE.DoubleSide,
		},
		point: {
			vertexShader: 'shader/triangle/point.vert',
			fragmentShader: 'shader/triangle/point.frag',
			side: THREE.DoubleSide,
		},
		position: {
			vertexShader: 'shader/filter/screen.vert',
			fragmentShader: 'shader/pass/position.frag',
		},
		rain: {
			vertexShader: 'shader/scene/rain.vert',
			fragmentShader: 'shader/scene/rain.frag',
			side: THREE.DoubleSide,
		},
		smoke: {
			vertexShader: 'shader/scene/smoke.vert',
			fragmentShader: 'shader/scene/smoke.frag',
			side: THREE.DoubleSide,
			depthTest: false,
			opacity: .5,
			transparent: true,
		},
		snow: {
			vertexShader: 'shader/scene/snow.vert',
			fragmentShader: 'shader/scene/snow.frag',
			side: THREE.DoubleSide,
		},
		text: {
			vertexShader: 'shader/triangle/text.vert',
			fragmentShader: 'shader/triangle/text.frag',
			side: THREE.DoubleSide,
		},
		tree: {
			vertexShader: 'shader/scene/tree.vert',
			fragmentShader: 'shader/scene/tree.frag',
			side: THREE.DoubleSide,
		},
		velocity: {
			vertexShader: 'shader/filter/screen.vert',
			fragmentShader: 'shader/pass/velocity.frag',
		},
	}
};
