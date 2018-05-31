import { BufferAttribute, Vector3 } from 'three.js';

export function arrayVec3Distance(array, index, nextIndex) {
	return distance2(array[index],array[index+1],array[index+2], array[nextIndex],array[nextIndex+1],array[nextIndex+2]);
}

export function getRandomPoints(count) {
	var points = [];
	for (var i = 0; i < count * 3; ++i) points.push(randomRange(-1,1));
	return points;
}

export function decimateAttributes(attributes, step) {
	step = step || 1;
	var att = {};
	var keys = Object.keys(attributes);
	keys.forEach(name => {
		var size = attributes[name].itemSize;
		att[name] = { array: [], itemSize: size};
		for (var i = 0; i < attributes[name].array.length / size; i += step) {
			for (var x = 0; x < size; ++x) {
				var item = attributes[name].array[i*size+x];
				att[name].array.push(item);
			}
		}
	});
	return att;
}

export function randomRange(min, max) {
	return min+Math.random()*(max-min);
}

export function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

export function saturate(value) {
	return Math.max(0, Math.min(1, value));
}

//https://github.com/mattdesl/lerp/blob/master/index.js
export function lerp(v0, v1, t) {
	return v0*(1-t)+v1*t;
}

export function lerpArray(a0, a1, t) {
	for (var i = 0; i < a0.length; ++i) {
		a0[i] = lerp(a0[i], a1[i], t);
	}
	return a0;
}

export function lerpVector(a0, a1, t) {
	a0.x = lerp(a0.x, a1.x, t);
	a0.y = lerp(a0.y, a1.y, t);
	a0.z = lerp(a0.z, a1.z, t);
	return a0;
}

export function lerpVectorArray(a0, a1, t) {
	a0.x = lerp(a0.x, a1[0], t);
	a0.y = lerp(a0.y, a1[1], t);
	a0.z = lerp(a0.z, a1[2], t);
	return a0;
}

// Find the closest power of 2
export function closestPowerOfTwo (num) {
	return Math.pow(2, Math.ceil(Math.log(num) / Math.log(2)));
}

// Used to calculate length of vector from center of box to corner of box
export const sqrt3 = Math.sqrt(3);

//
export function distance1(a, b) {
	return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)+(a.z-b.z)*(a.z-b.z));
}

//
export function distance2(x,y,z,xx,yy,zz) {
	return Math.sqrt((x-xx)*(x-xx)+(y-yy)*(y-yy)+(z-zz)*(z-zz));
}

// Thank to Tomas Akenine-Möller
// For sharing his Triangle Box Overlaping algorithm
// http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/tribox3.txt

export function planeBoxOverlap(normal, vert, maxbox)
{
	var vmin = new Vector3(0,0,0);
	var vmax = new Vector3(0,0,0);
	if(normal.x > 0) { vmin.x = -maxbox.x - vert.x; vmax.x = maxbox.x - vert.x;	}
	else { vmin.x = maxbox.x - vert.x; vmax.x = -maxbox.x - vert.x; }
	if(normal.y > 0) { vmin.y = -maxbox.y - vert.y; vmax.y = maxbox.y - vert.y;	}
	else { vmin.y = maxbox.y - vert.y; vmax.y = -maxbox.y - vert.y; }
	if(normal.z > 0) { vmin.z = -maxbox.z - vert.z; vmax.z = maxbox.z - vert.z;	}
	else { vmin.z = maxbox.z - vert.z; vmax.z = -maxbox.z - vert.z; }
	var min = new Vector3(normal.x, normal.y, normal.z);
	var max = new Vector3(normal.x, normal.y, normal.z);
	if (min.dot(vmin) > 0) return 0;
	if (max.dot(vmax) >= 0) return 1;
	return 0;
}

export function triangleArea (a, b, c)
{
	var ab = (new Vector3(a.x,a.y,a.z)).sub(b);
	var ac = (new Vector3(a.x,a.y,a.z)).sub(c);
	return ab.cross(ac).length() / 2;
}

export function triBoxOverlap(boxcenter, boxhalfsize, a, b, c)
{
	var v0 = {x:0, y:0, z:0};
	var v1 = {x:0, y:0, z:0};
	var v2 = {x:0, y:0, z:0};
	var min, max, p0, p1, p2, rad, fex, fey, fez;
	var normal = new Vector3(0,0,0);
	var e0 = new Vector3(0,0,0);
	var e1 = new Vector3(0,0,0);
	var e2 = new Vector3(0,0,0);

	/* This is the fastest branch on Sun */
	/* move everything so that the boxcenter is in (0,0,0) */
	v0.x = a.x - boxcenter.x; v0.y = a.y - boxcenter.y; v0.z = a.z - boxcenter.z;
	v1.x = b.x - boxcenter.x; v1.y = b.y - boxcenter.y; v1.z = b.z - boxcenter.z;
	v2.x = c.x - boxcenter.x; v2.y = c.y - boxcenter.y; v2.z = c.z - boxcenter.z;
	/* compute triangle edges */
	e0.x = v1.x - v0.x; e0.y = v1.y - v0.y; e0.z = v1.z - v0.z;
	e1.x = v2.x - v1.x; e1.y = v2.y - v1.y; e1.z = v2.z - v1.z;
	e2.x = v0.x - v2.x; e2.y = v0.y - v2.y; e2.z = v0.z - v2.z;

	/* Bullet 3:  */
	/*  test the 9 tests first (this was faster) */
	fex = Math.abs(e0.x);
	fey = Math.abs(e0.y);
	fez = Math.abs(e0.z);
	//
	p0 = e0.z * v0.y - e0.y * v0.z;
	p2 = e0.z * v2.y - e0.y * v2.z;
	if (p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }
	rad = fez * boxhalfsize.y + fey * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p0 = -e0.z * v0.x + e0.x * v0.z;
	p2 = -e0.z * v2.x + e0.x * v2.z;
	if(p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }
	rad = fez * boxhalfsize.x + fex * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p1 = e0.y * v1.x - e0.x * v1.y;
	p2 = e0.y * v2.x - e0.x * v2.y;
	if (p2 < p1) { min = p2; max = p1; } else { min = p1; max = p2; }
	rad = fey * boxhalfsize.x + fex * boxhalfsize.y;
	if (min > rad || max < -rad) return 0;
	//
	fex = Math.abs(e1.x);
	fey = Math.abs(e1.y);
	fez = Math.abs(e1.z);
	//
	p0 = e1.z * v0.y - e1.y * v0.z;
	p2 = e1.z * v2.y - e1.y * v2.z;
	if (p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }
	rad = fez * boxhalfsize.y + fey * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p0 = -e1.z * v0.x + e1.x * v0.z;
	p2 = -e1.z * v2.x + e1.x * v2.z;
	if (p0 < p2) { min = p0; max = p2; } else { min = p2; max = p0; }
	rad = fez * boxhalfsize.x + fex * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p0 = e1.y * v0.x - e1.x * v0.y;
	p1 = e1.y * v1.x - e1.x * v1.y;
	if (p0 < p1) { min = p0; max = p1; } else { min = p1; max = p0; }
	rad = fey * boxhalfsize.x + fex * boxhalfsize.y;
	if (min > rad || max < -rad) return 0;
	//
	fex = Math.abs(e2.x);
	fey = Math.abs(e2.y);
	fez = Math.abs(e2.z);
	//
	p0 = e2.z * v0.y - e2.y * v0.z;
	p1 = e2.z * v1.y - e2.y * v1.z;
	if (p0 < p1) { min = p0; max = p1; } else { min = p1; max = p0; }
	rad = fez * boxhalfsize.y + fey * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p0 = -e2.z * v0.x + e2.x * v0.z;
	p1 = -e2.z * v1.x + e2.x * v1.z;
	if (p0 < p1) { min = p0; max = p1; } else { min = p1; max = p0; }
	rad = fez * boxhalfsize.x + fex * boxhalfsize.z;
	if (min > rad || max < -rad) return 0;
	//
	p1 = e2.y * v1.x - e2.x * v1.y;
	p2 = e2.y * v2.x - e2.x * v2.y;
	if (p2 < p1) { min = p2; max = p1; } else { min = p1; max = p2;}
	rad = fey * boxhalfsize.x + fex * boxhalfsize.y;
	if (min > rad || max < -rad) return 0;

	/* Bullet 1: */
	/*  first test overlap in the {x,y,z}-directions */
	/*  find min, max of the triangle each direction, and test for overlap in */
	/*  that direction -- this is equivalent to testing a minimal AABB around */
	/*  the triangle against the AABB */
	/* test in X-direction */
	min = Math.min(v0.x, Math.min(v1.x, v2.x));
	max = Math.max(v0.x, Math.max(v1.x, v2.x));
	if (min > boxhalfsize.x || max < -boxhalfsize.x) return 0;
	/* test in Y-direction */
	min = Math.min(v0.y, Math.min(v1.y, v2.y));
	max = Math.max(v0.y, Math.max(v1.y, v2.y));
	if (min > boxhalfsize.y || max < -boxhalfsize.y) return 0;
	/* test in Z-direction */
	min = Math.min(v0.z, Math.min(v1.z, v2.z));
	max = Math.max(v0.z, Math.max(v1.z, v2.z));
	if (min > boxhalfsize.z || max < -boxhalfsize.z) return 0;
	/* Bullet 2: */
	/*  test if the box intersects the plane of the triangle */
	/*  compute plane equation of triangle: normal*x+d=0 */
	normal.crossVectors(e0, e1);
	if ( 0 == planeBoxOverlap(normal, v0, boxhalfsize)) return 0;
	return 1;   /* box and triangle overlaps */
}
