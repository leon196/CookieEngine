
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float dimension;
uniform float blendSmoke;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vDirScreen;
varying vec2 vAnchor;
varying float vRatio;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;
	float x = position.x*.5+.5;
	float y = position.y*.5+.5;
	vec2 seed = vec2(x,y);
	float index = x * dimension + y * dimension * dimension;
	float height = 5.;
	vec2 size = vec2(10);
	float speed = .2 + noiseIQ(vec3(seed,1));
	vec3 pos = position;
	vPos = position;
	// pos.x = (x*2.-1.) * range;
	float ratio = mod(rand(seed)*2.+time*speed, 1.);
	vRatio = ratio;

	pos.y += ratio * height;
	size *= ratio * rand(seed) * blendSmoke;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += anchor.x * aspect.x * size.x;
	gl_Position.y += anchor.y * aspect.y * size.y;
}