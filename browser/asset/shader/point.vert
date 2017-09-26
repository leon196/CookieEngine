
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec2 vDirScreen;
varying vec2 vAnchor;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;
	float x = position.x*.5+.5;
	float y = position.y*.5+.5;
	float index = x * 256. + y * 256. * 256.;
	float angle = index * .5;
	float range = 4.;
	float radius = mod(index * .01 + time *.2, range);
	x = cos(angle) * radius;
	y = sin(angle) * radius;
	float height = 30.;
	vec3 pos = vec3(x, 0, y) * range;
	pos.y = height-mod(rand(vec2(position.x,position.y))+time*.03, 1.)*height;
	float ground = noiseIQ(vec3(x,y,0)*3.);
	float ratio = clamp(abs(pos.y / height), 0., 1.);
	pos.y = height * (1.-smoothstep(0.,.5,1.-ratio));
	pos.y = max(pos.y, ground / 2.);
	pos.x += rand(position.xz);
	vec4 posScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position = posScreen;
	float size = .05 * (1.-smoothstep(.9,1.,1.-ratio));
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += anchor.x * size * aspect.x;
	gl_Position.y += anchor.y * size * aspect.y;
}