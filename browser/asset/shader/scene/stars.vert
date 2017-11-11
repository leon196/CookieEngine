
attribute vec2 anchor;
attribute vec2 texcoord;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec2 vAnchor;

vec3 displace (vec3 pos, float ratio) {
	float dist = length(pos);
	pos.xy *= rot(dist + ratio + time);
	return pos;
}

void main()	{
	vec2 size = vec2(2.,1.);
	vUv = uv;
	vAnchor = anchor;
	vec3 pos = position*2.-1.;
	pos *= 40.;

	float ratio = mod(rand(pos.xy),1.);
	pos = displace(pos, ratio);
	float delta = .01;
	vec3 next = displace(pos, mod(ratio+delta, 1.));
	vec3 prev = displace(pos, mod(ratio-delta+1., 1.));
	vec3 direction = normalize(next-prev);
	vec3 up = vec3(0,1,0);
	vec3 tangent = cross(direction, up);
	// pos += up * anchor.y * size + tangent * anchor.x * size;

	vec4 nextMVP = projectionMatrix * viewMatrix * modelMatrix * vec4(next,1);
	vec4 prevMVP = projectionMatrix * viewMatrix * modelMatrix * vec4(prev,1);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 pivot = anchor * rot(PI/4.);
	vec2 front = normalize(nextMVP.xy-prevMVP.xy);
	front.xy *= rot(PI/4.);
	vec2 right = vec2(front.y, -front.x);
	gl_Position.xy += front * anchor.x * size.x * aspect.x;
	gl_Position.xy += right * anchor.y * size.y * aspect.y;
}
