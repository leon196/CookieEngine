
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
	float range = 20.;
	float height = 10.;
	vec2 size = vec2(20);
	float speed = .2 + noiseIQ(vec3(seed,1));
	vec3 pos = position;
	// pos.x = (x*2.-1.) * range;
	float ratio = mod(rand(seed)*2.+time*speed, 1.);
	vRatio = ratio;
	pos.y += ratio * height;
	// size *= smoothstep(0.,.2,ratio);
	size *= ratio;
	// size *= smoothstep(0.,.3,1.-ratio);
	size *= rand(seed);
	size *= blendSmoke;
	// pos.z = (y*2.-1.) * range;
	vec4 posScreenA = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	// vec4 posScreenB = projectionMatrix * viewMatrix * modelMatrix * vec4(pos+vec3(0,size,0),1);
	gl_Position = posScreenA;
	vec2 pivot = anchor;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += pivot.x * aspect.x * size.x;
	gl_Position.y += pivot.y * aspect.y * size.y;
	// gl_Position.x = mix(gl_Position.x, posScreenB.x, clamp(anchor.x,0.,1.));
	// gl_Position.y = mix(gl_Position.y, posScreenB.y, clamp(anchor.y,0.,1.));
}