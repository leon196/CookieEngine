
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
	float x = position.x;
	float y = position.y;
	float range = 20.;
	float height = 30.;
	vec3 pos = vec3(x, 0, y) * range;
	pos.y = height-mod(rand(vec2(x,y))+time*.03, 1.)*height;
	float ground = noiseIQ(vec3(x,y,0)*3.);
	float ratio = clamp(abs(pos.y / height), 0., 1.);
	pos.y = max(pos.y, ground * 5.);
	vec4 posScreen = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position = posScreen;
	float size = .1 * (1.-smoothstep(.9,1.,1.-ratio));
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += anchor.x * size * aspect.x;
	gl_Position.y += anchor.y * size * aspect.y;
}