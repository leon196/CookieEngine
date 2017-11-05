
import * as THREE from 'three.js'
import { randomRange, closestPowerOfTwo } from '../libs/misc'

export default class Geometry {
	constructor() {}

	static createFromAttributes(attributes) {
		let geometry = new THREE.BufferGeometry();
		let names = Object.keys(attributes);
		names.forEach( name => { geometry.addAttribute( name, attributes[name] ); });
		geometry.boundingBox = new THREE.Box3(new THREE.Vector3(-100,-100,-100), new THREE.Vector3(100,100,100));
		geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), 100);
		return geometry;
	}

	static createRandom(count) {
		return Geometry.createFromAttributes(Geometry.getRandomAttributes(count | 9));
	}

	static getRandomBuffer(count, step) {
		var array = new Float32Array(count * step);
		for (var i = 0; i < array.length; i++) {
			array[i] = randomRange(0,1);
		}
		return new THREE.BufferAttribute(array, step);
	}

	static getRandomAttributes(count) {
		return {
			position: Geometry.getRandomBuffer(count, 3),
			color: Geometry.getRandomBuffer(count, 3),
			normal: Geometry.getRandomBuffer(count, 3),
			uv: Geometry.getRandomBuffer(count, 2),
		}
	}

	static createTriangleFromPoints (attributes)
	{
		// variables
		var count = attributes.position.array.length / 3;
		var dimension = closestPowerOfTwo(Math.sqrt(count));
		var indexVertex = 0, indexUV = 0, indexAnchor = 0, u, v;

		// attributes
		var arrays = {};
		var attributeNames = Object.keys(attributes);
		attributeNames.forEach(name => {
			arrays[name] = new Float32Array(count * 3 * attributes[name].itemSize);
		});
		var anchors = new Float32Array(count * 3 * 2);
		var indexMap = new Float32Array(count * 3 * 2);

		// triangles
		for (var triangleIndex = 0; triangleIndex < count; triangleIndex++) {

			// uv is used to map vertex index to bitmap data
			u = (triangleIndex % dimension) / dimension;
			v = Math.floor(triangleIndex / dimension) / dimension;

			// positions and normals are on the same for the 3 points
			for (var tri = 0; tri < 3; ++tri)
			{
				attributeNames.forEach(name => {
					let itemSize = attributes[name].itemSize;
					for (var i = 0; i < itemSize; i++) {
						arrays[name][triangleIndex*9+tri*itemSize+i] = attributes[name].array[triangleIndex*itemSize+i];
					}
				});

				indexMap[indexUV+0] = u;
				indexMap[indexUV+1] = v;

		    indexVertex += 3;
		    indexUV += 2;
		  }

		 	// offset used to scale triangle in shader
			anchors[indexAnchor] = 0;
			anchors[indexAnchor+1] = 1;
			anchors[indexAnchor+2] = -1;
			anchors[indexAnchor+3] = -1;
			anchors[indexAnchor+4] = 1;
			anchors[indexAnchor+5] = -1;
			indexAnchor += 6;
		}

		var geometry = new THREE.BufferGeometry();
		attributeNames.forEach(name => {
			geometry.addAttribute(name, new THREE.BufferAttribute(arrays[name], attributes[name].itemSize));
		});
		geometry.addAttribute( 'anchor', new THREE.BufferAttribute( anchors, 2 ) );
		geometry.addAttribute( 'indexMap', new THREE.BufferAttribute( indexMap, 2 ) );

		var min = -100;
		var max = 100;
		geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));
		geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), max);

		return geometry;
	}
	static createQuadFromPoints (attributes)
	{
		// variables
		var count = attributes.position.array.length / 3;
		var dimension = closestPowerOfTwo(Math.sqrt(count));
		var indexVertex = 0, indexUV = 0, indexAnchor = 0, indexIndex = 0, vertexIndex = 0, u, v;

		// attributes
		var arrays = {};
		var attributeNames = Object.keys(attributes);
		attributeNames.forEach(name => {
			arrays[name] = new Float32Array(count * 4 * attributes[name].itemSize);
		});
		var anchors = new Float32Array(count * 4 * 2);
		var indexMap = new Float32Array(count * 4 * 2);
		var indices = new Uint16Array(count * 6);

		for (var i = 0; i+5 < indices.length; i+=6) {
		}

		// console.log()

		// triangles
		for (var quadIndex = 0; quadIndex < count; quadIndex++) {

			// uv is used to map vertex index to bitmap data
			u = (quadIndex % dimension) / dimension;
			v = Math.floor(quadIndex / dimension) / dimension;

			// positions and normals are on the same for the 4 points
			for (var quad = 0; quad < 4; ++quad)
			{
				attributeNames.forEach(name => {
					var itemSize = attributes[name].itemSize;
					for (var i = 0; i < itemSize; i++) {
						arrays[name][quadIndex*4*itemSize+quad*itemSize+i] = attributes[name].array[quadIndex*itemSize+i];
					}
				});

				indexMap[indexUV+0] = u;
				indexMap[indexUV+1] = v;
		    indexUV += 2;
		  }

			vertexIndex = quadIndex*4*3;
			indices[quadIndex*6+0] = vertexIndex+0;
			indices[quadIndex*6+1] = vertexIndex+1;
			indices[quadIndex*6+2] = vertexIndex+2;
			indices[quadIndex*6+3] = vertexIndex+2;
			indices[quadIndex*6+4] = vertexIndex+3;
			indices[quadIndex*6+5] = vertexIndex+0;

		 	// offset used to scale quad in shader
			anchors[indexAnchor+0] = -1;
			anchors[indexAnchor+1] = -1;
			anchors[indexAnchor+2] = -1;
			anchors[indexAnchor+3] = 1;
			anchors[indexAnchor+4] = 1;
			anchors[indexAnchor+5] = 1;
			anchors[indexAnchor+6] = 1;
			anchors[indexAnchor+7] = -1;
			indexAnchor += 8;
		}

		var geometry = new THREE.BufferGeometry();
		attributeNames.forEach(name => {
			geometry.addAttribute(name, new THREE.BufferAttribute(arrays[name], attributes[name].itemSize));
		});
		geometry.addAttribute( 'anchor', new THREE.BufferAttribute( anchors, 2 ) );
		geometry.addAttribute( 'indexMap', new THREE.BufferAttribute( indexMap, 2 ) );
		geometry.setIndex(new THREE.BufferAttribute(indices, 1));

		var min = -100;
		var max = 100;
		geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));
		geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), max);

		return geometry;
	}
}