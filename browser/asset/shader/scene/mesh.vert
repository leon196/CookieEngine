
// attribute float number;
uniform float time;
varying vec2 vUv;

vec3 pointAt (float ratio) {
	float a = ratio * PI2;
	return vec3(cos(a),0,sin(a))*2.;
}

#define wave smoothstep(.0, 1., sin(time*3.14159*4.))

void main()	{
	vUv = uv;

	vec3 pos = (modelMatrix * vec4(position, 1.)).xyz;
	// pos.x += number * 3.;
	float twist = .5;
	pos.y += time;
	pos.xz *= rot(pos.y * twist + time);

	// pos.xz *= 1. + .5 * sin(pos.y + time);
	float forwardCurve = pos.y;
	float rightCurve = pos.x;
	float upCurve = pos.z;
	float _PlanarScale = 0.5;
	float _CurveScale = 0.05;

	float ratio = mod(forwardCurve * _CurveScale, 1.);

	float angle = atan(upCurve, rightCurve);
	float radius = length(vec2(rightCurve * _PlanarScale, upCurve * _PlanarScale));

	vec3 bezierPoint = pointAt(ratio);

	float unit = .01;
	float next = mod(ratio + unit, 1.0);
	float prev = mod(ratio - unit + 1.0, 1.0);
	vec3 bezierPointNext = pointAt(next);
	vec3 bezierPointPrevious = pointAt(prev);

	vec3 forward = normalize(bezierPointNext - bezierPoint);
	vec3 up = vec3(0,1,0);
	vec3 right = normalize(cross(forward, up));

	pos.xyz = bezierPoint + (right * cos(angle) * radius + up * sin(angle) * radius);
	gl_Position = projectionMatrix * viewMatrix * vec4(pos,1);
}
