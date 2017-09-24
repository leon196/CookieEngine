
import * as THREE from 'three.js'
import { closestPowerOfTwo } from '../utils/utils';
import { assets } from '../utils/assets';

export function Particle (attributes)
{
	var positionArray = attributes.position.array;
	var colorArray = attributes.color.array;
	var normalArray = attributes.normal.array;
	this.geometry = createGeometryForParticles(positionArray, colorArray, normalArray);

	this.uniforms = {
		time: { value: 1.0 },
		positionTexture: { value: 0 },
		velocityTexture: { value: 0 },
		matrix: { value: 0 },
		pivot: { value: 0 },
	};

	this.mesh = new THREE.Mesh(this.geometry, new THREE.ShaderMaterial( {
		uniforms: this.uniforms,
		vertexShader: assets.shaders["particle.vert"],
		fragmentShader: assets.shaders["color.frag"],
		side: THREE.DoubleSide
	}));
}

function createGeometryForParticles (positionArray, colorArray, normalArray)
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
	var normals = new Float32Array(count * 3 * 3);
	var anchor = new Float32Array(count * 3 * 2);
	var texcoord = new Float32Array(count * 3 * 2);

	// triangles
	for (var triangleIndex = 0; triangleIndex < count; triangleIndex++) {

		ia = triangleIndex*3;
		ib = triangleIndex*3+1;
		ic = triangleIndex*3+2;

		x = positionArray[ia];
		y = positionArray[ib];
		z = positionArray[ic];

		nx = normalArray[ia];
		ny = normalArray[ib];
		nz = normalArray[ic];

		// uv is used to map vertex index to bitmap data
		u = (triangleIndex % dimension) / dimension;
		v = Math.floor(triangleIndex / dimension) / dimension;

		// positions and normals are on the same for the 3 points
		for (var tri = 0; tri < 3; ++tri) {
			vertices[indexVertex] = x;
			vertices[indexVertex+1] = y;
			vertices[indexVertex+2] = z;

			normals[indexVertex] = nx;
			normals[indexVertex+1] = ny;
			normals[indexVertex+2] = nz;
	    indexVertex += 3;

			texcoord[indexUV] = u;
			texcoord[indexUV+1] = v;
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
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	geometry.addAttribute( 'anchor', new THREE.BufferAttribute( anchor, 2 ) );
	geometry.addAttribute( 'texcoord', new THREE.BufferAttribute( texcoord, 2 ) );
	
	var min = -100;
	var max = 100;
	geometry.boundingBox = new THREE.Box3(new THREE.Vector3(min,min,min), new THREE.Vector3(max,max,max));

	return geometry;
}	

