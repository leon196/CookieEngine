
import * as THREE from 'three.js'
import { randomRange, closestPowerOfTwo } from '../libs/misc'

export default class Geometry {
	constructor() {}

	static getRandomPoints(count) {
		var points = [];
		for (var i = 0; i < count * 3; ++i) points.push(randomRange(-1,1));
		return points;
	}

	static createTriangleFromPoints (attributes) {
		// variables
		var count = attributes.position.array.length / 3;
		var dimension = closestPowerOfTwo(Math.sqrt(count));
		var indexVertex = 0, indexUV = 0, indexAnchor = 0, u, v;
		// attributes
		var arrays = {};
		var attributeNames = Object.keys(attributes);
		attributeNames.forEach(name => { arrays[name] = new Float32Array(count * 3 * attributes[name].itemSize); });
		var anchors = new Float32Array(count * 3 * 2);
		var indexMap = new Float32Array(count * 3 * 2);
		// triangles
		for (var triangleIndex = 0; triangleIndex < count; triangleIndex++) {
			// uv is used to map vertex index to bitmap data
			u = (triangleIndex % dimension) / dimension;
			v = Math.floor(triangleIndex / dimension) / dimension;
			// positions and normals are on the same for the 3 points
			for (var tri = 0; tri < 3; ++tri) {
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

	static create (total, attributes, slices, material)
	{
		// variables
		var slices = slices || [1,1];
		var dimension = closestPowerOfTwo(Math.sqrt(total));
		var faces = [slices[0]+1, slices[1]+1];
		var vertexCount = faces[0] * faces[1];
		var quadCount = slices[0] * slices[1];

		var meshes = [];
		var verticesMax = 65000;
		var totalVertices = total * vertexCount;
		var meshCount = 1 + Math.floor(totalVertices / verticesMax);
		var pointIndex = 0;
		for (var m = 0; m < meshCount; ++m) {

			var count;
			if (meshCount > 1) {
				if (m == meshCount - 1) count = totalVertices % verticesMax;
				else count = verticesMax;
			} else count = totalVertices;

			// attributes
			var arrays = {};
			var anchors = [];
			var indexMap = [];
			var indices = [];
			var vIndex = 0;
			var attributeNames = Object.keys(attributes);
			attributeNames.forEach(name => { arrays[name] = []; });

			for (var index = 0; index < count; ++index) {
				var pIndex = Math.floor(pointIndex/4);
				var u = (pIndex % dimension) / dimension;
				var v = Math.floor(pIndex / dimension) / dimension;
				for (var vertex = 0; vertex < vertexCount; ++vertex) {
					attributeNames.forEach(name => {
						var itemSize = attributes[name].itemSize;
            var array = attributes[name].array;
            for (var i = 0; i < itemSize; i++) {
							arrays[name].push(array[pIndex*itemSize+i]);
						}
					});
					var x = (vertex % faces[0]) / slices[0];
					var y = Math.floor(vertex / faces[0]) / slices[1];
					anchors.push(x*2.-1., y*2.-1.);
					indexMap.push(u,v);
				}
				indices.push(vIndex, vIndex+1, vIndex+2, vIndex+1, vIndex+3, vIndex+2);
				vIndex += 4;
				pointIndex += 1;
			}

			var geometry = new THREE.BufferGeometry();
			attributeNames.forEach(name => {
        var array = new Float32Array(arrays[name]);
				geometry.addAttribute(name, new THREE.BufferAttribute(array, attributes[name].itemSize));
			});
			geometry.addAttribute( 'anchor', new THREE.BufferAttribute( new Float32Array(anchors), 2 ) );
			geometry.addAttribute( 'indexMap', new THREE.BufferAttribute( new Float32Array(indexMap), 2 ) );
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

			var min = -100;
			var max = 100;
			geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));
			geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), max);
			let mesh = new THREE.Mesh(geometry, material);
      // mesh.drawMode = THREE.TriangleStripDrawMode;
			meshes.push(mesh);
		}

		return meshes;
	}
}
