
import * as THREE from 'three.js'
import { closestPowerOfTwo } from '../utils/utils';
import { asset } from '../editor/asset';
import { ShaderPass } from './shaderpass';
import { material } from '../editor/material';
import { parameter } from '../editor/parameter';

export function Line (attributes)
{
	this.uniforms = {
		time: { value: 1.0 },
		resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
		frameBuffer: { value: 0 },
	};

	var positionArray = attributes.position.array;

	var colorArray;
	if (attributes.color) colorArray = attributes.color.array;
	else colorArray = getDefaultColorArray(positionArray.length);

	var normalArray = attributes.normal.array;

	var dimension = closestPowerOfTwo(Math.sqrt(positionArray.length / 3));
	
	this.geometry = createGeometryForLine(positionArray, colorArray, normalArray);
	this.mesh = new THREE.Mesh(this.geometry, material.line);
	// this.geometry = new THREE.PlaneGeometry(10., Math.abs(2.)*2., 96, 1 );
	// this.mesh = new THREE.Mesh( this.geometry, material.line );

	this.parameterList = Object.keys(parameter);
	for (var i = 0; i < this.parameterList.length; i++) {
		this.uniforms[this.parameterList[i]] = { value: 0 };
	}

	this.update = function (elapsed)
	{
		this.uniforms.time.value = elapsed;
		for (var i = 0; i < this.parameterList.length; i++) {
			this.uniforms[this.parameterList[i]].value = parameter[this.parameterList[i]];
		}
	}
}

function getDefaultColorArray (count)
{
	var array = [];
	for (var i = count - 1; i >= 0; i--) {
		array[i] = 1;
	}
	return array;
}


function createGeometryForLine (positionArray, colorArray, normalArray)
{
	var geometry = new THREE.BufferGeometry();

	// variables
	var x, y, z, ia, ib, ic, u, v, nx, ny, nz;
	var indexVertex = 0, indexUV = 0, indexAnchor = 0;
	var dimension = closestPowerOfTwo(Math.sqrt(positionArray.length / 3));
	var count = positionArray.length * 2 / 3;
	var resolution = dimension*dimension;

	// attributes
	var vertices = new Float32Array(count * 3 * 3);
	var lineEnd = new Float32Array(count * 3 * 3);
	var normals = new Float32Array(count * 3 * 3);
	var colors = new Float32Array(count * 3 * 3);
	var anchor = new Float32Array(count * 3 * 2);
	var texcoord = new Float32Array(count * 3 * 2);

	// triangles
	for (var lineIndex = 0; lineIndex < count - 2 && lineIndex*3+5 < count; lineIndex += 2) {

		ia = lineIndex*3;
		ib = lineIndex*3+1;
		ic = lineIndex*3+2;

		id = lineIndex*3+3;
		ie = lineIndex*3+4;
		ig = lineIndex*3+5;

		// uv is used to map vertex index to bitmap data
		u = (lineIndex % dimension) / dimension;
		v = Math.floor(lineIndex / dimension) / dimension;

		// positions and normals are on the same for the 3 points
		for (var tri = 0; tri < 6; ++tri)
		{
			vertices[indexVertex+0] = positionArray[ia];
			vertices[indexVertex+1] = positionArray[ib];
			vertices[indexVertex+2] = positionArray[ic];

			lineEnd[indexVertex+0] =  positionArray[id];
			lineEnd[indexVertex+1] =  positionArray[ie];
			lineEnd[indexVertex+2] =  positionArray[ig];

			normals[indexVertex+0] = normalArray[ia];
			normals[indexVertex+1] = normalArray[ib];
			normals[indexVertex+2] = normalArray[ic];

	    colors[indexVertex+0] = colorArray[ia];
	    colors[indexVertex+1] = colorArray[ib];
	    colors[indexVertex+2] = colorArray[ic];

			texcoord[indexUV+0] = u;
			texcoord[indexUV+1] = v;

	    indexVertex += 3;
	    indexUV += 2;
	  }

	 	// offset used to scale triangle in shader
		anchor[indexAnchor] = -1;
		anchor[indexAnchor+1] = 0;
		anchor[indexAnchor+2] = -1;
		anchor[indexAnchor+3] = 1;
		anchor[indexAnchor+4] = 1;
		anchor[indexAnchor+5] = 1;

		anchor[indexAnchor+6] = 1;
		anchor[indexAnchor+7] = 0;
		anchor[indexAnchor+8] = -1;
		anchor[indexAnchor+9] = 0;
		anchor[indexAnchor+10] = 1;
		anchor[indexAnchor+11] = 1;
		indexAnchor += 12;
	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	geometry.addAttribute( 'anchor', new THREE.BufferAttribute( anchor, 2 ) );
	geometry.addAttribute( 'texcoord', new THREE.BufferAttribute( texcoord, 2 ) );
	geometry.addAttribute( 'lineEnd', new THREE.BufferAttribute( lineEnd, 3 ) );
	
	var min = -100;
	var max = 100;
	geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));

	return geometry;
}	

function createDataTextureForParticles (dataArray, itemSize)
{
	var ia, ib, ic;
	var dimension = closestPowerOfTwo(Math.sqrt(dataArray.length / itemSize));
	var count = dataArray.length / itemSize;
	var resolution = dimension*dimension;
	var array = new Float32Array(resolution * itemSize);

	for (var lineIndex = 0; lineIndex < count; lineIndex++)
	{
		ia = lineIndex*3;
		ib = lineIndex*3+1;
		ic = lineIndex*3+2;

		array[ia] = dataArray[ia];
		array[ib] = dataArray[ib];
		array[ic] = dataArray[ic];
	}

	var texture = new THREE.DataTexture(array, dimension, dimension, THREE.RGBFormat, THREE.FloatType);
	texture.needsUpdate = true;

	return texture;
}	

