
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float dimension;
uniform float blendSmoke;
uniform float blendLeaf;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vAnchor;
varying float vRatio;
varying float vAngle;

void main()	{
	vNormal = normal;
	vAnchor = anchor;
	vViewDir = position - cameraPosition;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	float x = position.x*.5+.5;
	float y = position.y*.5+.5;
	vec2 seed = vec2(x,y);
	vTexcoord = seed;
	float index = x * dimension + y * dimension * dimension;
	float range = 20.;
	float height = 10.;
	vec2 size = vec2(.9,1.) * .5;
	float speed = .2 + noiseIQ(vec3(seed,1));
	size *= .1+.9*rand(seed);
	float t = time * .3;
	size *= smoothstep(.2, .8,noiseIQ(rotateY(rotateX(seed.xyy*.9, t), t*.5)));
	vec3 pos = position;
	size *= blendLeaf;
	pos.y += size.y*.5;
	float a = rand(seed) * PI2 + time;
	pos.x += cos(a) * .5 * clamp(vAnchor.y,0.,1.) * rand(seed);
	vAngle = a;
	// vNormal = pos - position;
	// pos.x = (x*2.-1.) * range;
	float ratio = mod(rand(seed)*2.+time*speed, 1.);
	vRatio = ratio;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	gl_Position.x += vAnchor.x * aspect.x * size.x;
	gl_Position.y += vAnchor.y * aspect.y * size.y;
}