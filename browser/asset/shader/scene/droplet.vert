
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float dimension;
uniform float blendStorm;
uniform float blendSmoke;
uniform float blendRain;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vDirScreen;
varying vec2 vAnchor;
varying float vRatio;
varying float vSplash;
varying float vSplashRatio;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;
	vec2 seed = vec2(position.xy);
	float height = 5.;
	float rnd = rand(seed);
	vec2 size = vec2(.05,2.);
	float speed = 1. + 1. * noiseIQ(vec3(seed,1));
	vec3 pos = displaceTree(position, time, blendStorm);
	vPos = position;
	float ratio = mod(rnd*2.+time*speed, 1.);
	vRatio = ratio;

	float startAt = .5;
	float yRatio = smoothstep(0.,startAt,ratio);
	vSplashRatio = smoothstep(startAt, 1., ratio);

	pos.x -= blendStorm * yRatio;
	pos.x += anchor.y * blendStorm * .2;

	pos.y -= yRatio * height;
	size *= smoothstep(.0,.1,ratio) * blendRain;

	// vSplash = step(startAt,yRatio);
	vSplash = step(pos.y,size.y);
	pos.y = max(0., pos.y);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	vec2 pivot = anchor;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += pivot.x * aspect.x * size.x * (1.-vSplash);
	gl_Position.y += pivot.y * aspect.y * size.y * (1.-vSplash);

	gl_Position.x += pivot.x * 3.5*(.8+.2*rnd) * vSplash * blendRain * vSplashRatio;
	gl_Position.y += pivot.y * 1.*(.8+.2*rnd) * vSplash * blendRain * vSplashRatio;
}