
import * as THREE from 'three.js'
import { randomRange, closestPowerOfTwo } from '../libs/misc'

export default class Geometry {
	constructor() {}

	static getRandomPoints(count) {
		var points = [];
		for (var i = 0; i < count * 3; ++i) points.push(randomRange(-1,1));
		return points;
	}

	static create (total, attributes, slices, material)
	{
		var meshes = [];
		var verticesMax = 65000;
		var dimension = closestPowerOfTwo(Math.sqrt(total));
		var meshCount = 1 + Math.floor(total / verticesMax);
		var slices = slices || [1,1];
		var faces = [slices[0]+1, slices[1]+1];
		var quadCount = slices[0] * slices[1];
		for (var m = 0; m < meshCount; ++m) {

			var count = total;
			if (meshCount > 1) {
				if (m == meshCount - 1) count = total % verticesMax;
				else count = verticesMax;
			}

			var arrays = {};
			var anchors = [];
			var indexMap = [];
			var indices = [];
			var vIndex = 0;
			var attributeNames = Object.keys(attributes);
			attributeNames.forEach(name => { arrays[name] = []; });

			for (var index = 0; index < count; ++index) {
				var u = (index % dimension) / dimension;
				var v = Math.floor(index / dimension) / dimension;
				for (var y = 0; y < faces[1]; ++y) {
					for (var x = 0; x < faces[0]; ++x) {
						attributeNames.forEach(name => {
							var itemSize = attributes[name].itemSize;
	            var array = attributes[name].array;
	            for (var i = 0; i < itemSize; i++) {
								arrays[name].push(array[index*itemSize+i]);
							}
						});
						var anchorX = x / slices[0];
						var anchorY = y / slices[1];
						anchors.push(anchorX*2.-1., anchorY*2.-1.);
						indexMap.push(u,v);
						// indices.push(vIndex);
						// ++vIndex;
					}
				}
				// indices.push(vIndex-1);
				// indices.push(vIndex);
				// indices.push(Math.min(vIndex, count));
				// console.log(quadCount);
				for (var face = 0; face < quadCount; ++face) {
					indices.push(vIndex, vIndex+1, vIndex+1+slices[0]);
					indices.push(vIndex+1, vIndex+1+slices[0], vIndex+2+slices[0]);
					vIndex += 1;
					// indices.push(vIndex, vIndex+1, vIndex+2, vIndex+1, vIndex+3, vIndex+2);
					// vIndex += 4;
				}
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
