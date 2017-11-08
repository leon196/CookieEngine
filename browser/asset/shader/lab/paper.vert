
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform vec2 resolution;

varying vec3 vDirection;
varying vec3 vView;
varying vec3 vNormal;
varying vec2 vAnchor;

vec3 displace (vec3 pos, float ratio) {
	vec3 p = pos;
	float dist = length(p);
	vec3 offset = vec3(noiseIQ(pos));
	float a = noiseIQ(pos)*PI2;
	offset.xz = vec2(cos(a),sin(a));
	offset.xz *= rot(ratio * PI2 + dist + time);
	offset.xy *= rot(ratio * PI2 + dist + time);
	p += offset;
	return p;
}

void main()	{
	vAnchor = anchor;
	vec3 pos;
	// pos = position;
	// pos = vec3(indexMap.x, 0, indexMap.y)*5.;
	float a = indexMap.y * PI2;
	pos.xy = vec2(cos(a),sin(a));
	pos.z = (indexMap.x*2.-1.) * 4.;
	pos *= 5.;
	vec2 size = vec2(.5);
	float ratio = mod(rand(pos.xz), 1.);
	float delta = .01;
	vec3 prev = displace(pos, mod(ratio+1.-delta, 1.));
	vec3 next = displace(pos, mod(ratio+delta, 1.));
	vec3 up = vec3(0,1,0);
	up.xy *= rot(ratio*2.);
	up.zy *= rot(ratio*3.);
	vDirection = normalize(next-prev);
	vNormal = cross(vDirection, up);
	pos = displace(pos, ratio);
	pos += vDirection * anchor.y * size.y;
	pos += vNormal * anchor.x * size.x;
	// pos.x += .5*sin(anchor.y+time+noiseIQ(pos)*5.)*(1.-anchor.y);
	vView = normalize(cameraPosition - pos);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	// gl_Position.x += anchor.x * aspect.x * size.x;
	// gl_Position.y += anchor.y * aspect.y * size.y;
}
