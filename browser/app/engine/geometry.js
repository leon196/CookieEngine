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

	static getRandomPoints(count, step) {
		var points = [];
		for (var i = 0; i < count*step; i++) {
			points.push(randomRange(0,1));
		}
		return points;
	}

	static getRandomAttributes(count) {
		return {
			position: Geometry.getRandomBuffer(count, 3),
			normal: Geometry.getRandomBuffer(count, 3),
			color: Geometry.getRandomBuffer(count, 3),
			uv: Geometry.getRandomBuffer(count, 2),
		};
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

	static createQuadFromPoints(points, material, slices) {
		// variables
		var slices = slices || [1, 1];
		var count = points.length / 3;
		var dimension = closestPowerOfTwo(Math.sqrt(count));
		var faces = [slices[0] + 1, slices[1] + 1];
		var vertexCount = faces[0] * faces[1];
		var quadCount = slices[0] * slices[1];

		var meshes = [];
		var verticesMax = 65000 - 1;
		var totalVertices = count * vertexCount;
		var meshCount = 1 + Math.floor(totalVertices / verticesMax);
		var pointIndex = 0;
		for (var m = 0; m < meshCount; ++m) {

			var count;
			if (meshCount > 1) {
				if (m == meshCount - 1) {
					count = totalVertices % verticesMax;
				}
				else {
					count = verticesMax;
				}
			} else {
				count = totalVertices;
			}

			// attributes
			// var arrays = {};
			var positions = [];
			var anchors = [];
			var indexMap = [];
			var indices = [];
			// var attributeNames = Object.keys(attributes);
			// attributeNames.forEach(name => { arrays[name] = []; });

			for (var index = 0; index < count; ++index) {

				// uv is used to map vertex index to bitmap data
				var u = (pointIndex % dimension) / dimension;
				var v = Math.floor(pointIndex / dimension) / dimension;

				for (var vertex = 0; vertex < vertexCount; ++vertex) {
					// attributeNames.forEach(name => {
					var itemSize = 3;
					for (var i = 0; i < itemSize; i++) {
						positions.push(points[pointIndex * itemSize + i]);
					}
					// });
					var x = (vertex % faces[0]) / faces[0];
					var y = Math.floor(vertex / faces[0]) / faces[1];
					anchors.push(x * 2 - 1, y * 2 - 1);
					indexMap.push(u, v);
				}

				// FIX ME
				var vertexIndex = index * vertexCount;
				for (var quad = 0; quad < quadCount; ++quad) {

					var x = quad % faces[0];
					var y = Math.floor(quad / faces[0]);
					var ia = x + y * faces[0];
					var a = vertexIndex + ia;

					var xb = x + 1;
					var yb = y;
					var ib = xb + yb * faces[0];
					var b = vertexIndex + ib;

					var xc = x;
					var yc = y + 1;
					var ic = xc + yc * faces[0];
					var c = vertexIndex + ic;

					var xd = x + 1;
					var yd = y + 1;
					var id = xd + yd * faces[0];
					var d = vertexIndex + id;

					indices.push(a, b, c, b, c, d);
				}

				pointIndex += 1;
			}

			var geometry = new THREE.BufferGeometry();
			// attributeNames.forEach(name => {
			// 	geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(arrays[name]), attributes[name].itemSize));
			// });
			geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 2));
			geometry.addAttribute('anchor', new THREE.BufferAttribute(new Float32Array(anchors), 2));
			geometry.addAttribute('indexMap', new THREE.BufferAttribute(new Float32Array(indexMap), 2));
			geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

			var min = -100;
			var max = 100;
			geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min, min, min), new THREE.Vector3(max, max, max));
			geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), max);

			let mesh = new THREE.Mesh(geometry, material);
			meshes.push(mesh);
		}

		return meshes;
	}

	static createRibbons(ribbonCount, segmentCount, material)
	{
		const meshes = [];

		const minBbox = -100;
		const maxBbox = 100;

		for (let ribbonIndex = 0; ribbonIndex < ribbonCount; ++ribbonIndex) {
			// an atttribute named position is mandatory, so pack values within.
			const positions = [];
			const seeds = [];

			const seed = (Math.sin(ribbonIndex));

			for (let segmentIndex = 0; segmentIndex <= segmentCount; ++segmentIndex) {
				// in [0, 1] along the ribbon length
				const lengthRatio = segmentIndex / segmentCount;

				// side either -1 or +1, the direction of the point perpendicular to the length
				positions.push(lengthRatio, -1);
				positions.push(lengthRatio, +1);

				seeds.push(seed, seed);
			}

			const geometry = new THREE.BufferGeometry();
			geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 2));
			geometry.addAttribute('seed', new THREE.BufferAttribute(new Float32Array(seeds), 1));

			geometry.boundingBox = new THREE.Box3(new THREE.Vector3(minBbox,minBbox,minBbox), new THREE.Vector3(maxBbox,maxBbox,maxBbox));
			geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), maxBbox);

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.x = randomRange(-1, 1);
			mesh.position.y = randomRange(-1, 1);
			mesh.position.z = randomRange(-1, 1);
			mesh.drawMode = THREE.TriangleStripDrawMode;
			meshes.push(mesh);
		}

		return meshes;
	}
}
