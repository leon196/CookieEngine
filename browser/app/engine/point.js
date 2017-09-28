
import * as THREE from 'three.js'
import { closestPowerOfTwo } from '../utils/utils';
import { asset } from '../editor/asset';
import { ShaderPass } from './shaderpass';
import { material } from '../editor/material';
import { parameter } from '../editor/parameter';

export function Point (count, mat)
{
	this.uniforms = {
		show: { value: 1.0 },
		time: { value: 1.0 },
		resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
	};

	var positionArray = getGridPosition(count);
	var colorArray = getDefaultColorArray(positionArray.length);
	var dimension = closestPowerOfTwo(Math.sqrt(positionArray.length / 3));
	
	this.geometry = createGeometryForParticles(positionArray, colorArray);
	this.mesh = new THREE.Mesh(this.geometry, mat);

	this.parameterList = Object.keys(parameter.global);
	for (var i = 0; i < this.parameterList.length; i++) {
		this.uniforms[this.parameterList[i]] = { value: 0 };
	}

	this.update = function (elapsed)
	{
		for (var i = 0; i < this.parameterList.length; i++) {
			this.uniforms[this.parameterList[i]].value = parameter[this.parameterList[i]];
		}
	}
}

function getGridPosition (count)
{
	var array = [];
	var dimension = closestPowerOfTwo(Math.sqrt(count));
	for (var i = 0; i < count; ++i)
	{
		var x = i % dimension;
		var y = Math.floor(i / dimension);
		array.push((x/dimension)*2.-1.);
		array.push((y/dimension)*2.-1.);
		// array.push(x/dimension);
		// array.push(y/dimension);
		array.push(0);
	}
	return array;
}

function getDefaultColorArray (count)
{
	var array = [];
	for (var i = count - 1; i >= 0; i--) {
		array[i] = 1;
	}
	return array;
}

function createGeometryForParticles (positionArray, colorArray)
{
	var geometry = new THREE.BufferGeometry();

	// variables
	var x, y, z, ia, ib, ic, u, v, nx, ny, nz;
	var indexVertex = 0, indexUV = 0, indexAnchor = 0;
	var dimension = closestPowerOfTwo(Math.sqrt(positionArray.length / 3));
	var count = positionArray.length / 3;
	var resolution = dimension*dimension;

	// attributes
	var vertices = new Float32Array(count * 3 * 3);
	var colors = new Float32Array(count * 3 * 3);
	var anchor = new Float32Array(count * 3 * 2);
	var texcoord = new Float32Array(count * 3 * 2);

	// triangles
	for (var triangleIndex = 0; triangleIndex < count; triangleIndex++) {

		ia = triangleIndex*3;
		ib = triangleIndex*3+1;
		ic = triangleIndex*3+2;

		// uv is used to map vertex index to bitmap data
		u = (triangleIndex % dimension) / dimension;
		v = Math.floor(triangleIndex / dimension) / dimension;

		// positions and normals are on the same for the 3 points
		for (var tri = 0; tri < 3; ++tri)
		{
			vertices[indexVertex+0] =  positionArray[ia];
			vertices[indexVertex+1] =  positionArray[ib];
			vertices[indexVertex+2] =  positionArray[ic];

	    colors[indexVertex+0] = colorArray[ia];
	    colors[indexVertex+1] = colorArray[ib];
	    colors[indexVertex+2] = colorArray[ic];

			texcoord[indexUV+0] = u;
			texcoord[indexUV+1] = v;

	    indexVertex += 3;
	    indexUV += 2;
	  }

	 	// offset used to scale triangle in shader
		anchor[indexAnchor] = 0;
		anchor[indexAnchor+1] = 1;
		anchor[indexAnchor+2] = -1;
		anchor[indexAnchor+3] = -1;
		anchor[indexAnchor+4] = 1;
		anchor[indexAnchor+5] = -1;
		indexAnchor += 6;
	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	geometry.addAttribute( 'anchor', new THREE.BufferAttribute( anchor, 2 ) );
	geometry.addAttribute( 'texcoord', new THREE.BufferAttribute( texcoord, 2 ) );
	
	var min = -1000;
	var max = 1000;
	geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));
	geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), max);

	return geometry;
}	
