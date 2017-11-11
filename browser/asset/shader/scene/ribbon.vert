
attribute float seed;

uniform float time;
uniform float blendPaper;
uniform vec2 resolution;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

const float positionDerivativeEpsilon = .02;

vec3 computePosition(float lengthRatio) {
	vec3 p = vec3(.8 + .2 * sin(seed * 10. + lengthRatio * 3.), 0, 0);
	p.xy *= rot(seed * PI2);
	p.xz *= rot(lengthRatio * PI2 + time);
	p.xy *= rot(lengthRatio * PI2 + time);
	p.yz *= rot(lengthRatio + time + p.x*.2);
	return p * 10.;
}

float computeHalfWidth(float lengthRatio) {
	return 1. + sin(seed + lengthRatio * 50. + time) * .15;
}

void main() {
	float lengthRatio = position.x;
	float side = position.y;

	vUv = vec2(lengthRatio, side);
	// vUv.x = fract(vUv.x*5.);
	vUv.x *= 10.;
	vUv.y *= .3;
	vUv.y = vUv.y*.5+.5;

	vec3 origin = modelMatrix[3].xyz,
		position = computePosition(lengthRatio),
		next = computePosition(lengthRatio + positionDerivativeEpsilon),
		previous = computePosition(lengthRatio - positionDerivativeEpsilon),
		direction = normalize(next - previous),
		normalHint = normalize( normalize(next - position) - normalize(position - previous)),
		sideDirection = normalize(cross(direction, normalHint)),
		adjustedPosition = origin + position + sideDirection * side * computeHalfWidth(lengthRatio);
	gl_Position = projectionMatrix * viewMatrix * vec4(adjustedPosition, 1);
	vPosition = adjustedPosition;
	vNormal = cross(sideDirection, direction);
}
