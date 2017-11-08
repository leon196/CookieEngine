
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
	static createQuadFromPoints (attributes, slices)
	{
		// variables
		var slices = slices || [1,1];
		var count = attributes.position.array.length / 3;
		var dimension = closestPowerOfTwo(Math.sqrt(count));

		// attributes
		var arrays = {};
		var attributeNames = Object.keys(attributes);
		attributeNames.forEach(name => { arrays[name] = []; });
		var anchors = [];
		var indexMap = [];
		var indices = [];

		for (var pointIndex = 0; pointIndex < count; pointIndex++) {

			// uv is used to map vertex index to bitmap data
			var u = (pointIndex % dimension) / dimension;
			var v = Math.floor(pointIndex / dimension) / dimension;

			for (var x = 0; x < slices[0]; ++x) {
				for (var y = 0; y < slices[1]; ++y) {
					for (var vertex = 0; vertex < 4; ++vertex) {
						attributeNames.forEach(name => {
							var itemSize = attributes[name].itemSize;
							for (var i = 0; i < itemSize; i++) {
								arrays[name].push(attributes[name].array[pointIndex*itemSize+i]);
							}
						});
						var xx = (x+(vertex < 2 ? 1-vertex%2 : vertex%2)) / Math.max(1,slices[0]-1);
						var yy = (y+Math.floor(vertex/2)) / Math.max(1,slices[1]-1);
						anchors.push(xx, yy);
						indexMap.push(u,v);
				  }

					var vertexIndex = (pointIndex+x+y*slices[0]*3*2)*4*3;
					for (var i = 0; i < 3*2; i++) {
						indices.push(vertexIndex + (i<3 ? i : ((i-1)%4)));
					}
				}
			}
		}

		var geometry = new THREE.BufferGeometry();
		attributeNames.forEach(name => {
			geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(arrays[name]), attributes[name].itemSize));
		});
		geometry.addAttribute( 'anchor', new THREE.BufferAttribute( new Float32Array(anchors), 2 ) );
		geometry.addAttribute( 'indexMap', new THREE.BufferAttribute( new Float32Array(indexMap), 2 ) );
		geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

		var min = -100;
		var max = 100;
		geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));
		geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), max);

		return geometry;
	}
}
