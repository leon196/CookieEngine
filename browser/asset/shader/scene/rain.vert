
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float blendRain;
uniform float blendStorm;
uniform float dimension;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec2 vDirScreen;
varying vec2 vAnchor;
varying float vSplash;
varying float vSplashRatio;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;
	vec2 seed = position.xy;
	float rnd = rand(seed);

	float range = 15.;
	float height = 20.;
	vec2 size = vec2(.02,3.);
	size *= blendRain;
	float speed = 1. + 3. * noiseIQ(vec3(seed*100.,0.));
	vec3 pos = position.xzy * range;

	float splashAt = .7;

	float ratio = mod(rnd*2.+time*speed, 1.);
	float yRatio = 1.-smoothstep(0.,splashAt,ratio);
	float splash = step(splashAt,ratio);
	float splashRatio = smoothstep(splashAt,1.,ratio);
	vSplash = splash;
	vSplashRatio = splashRatio;

	float x = pos.x + blendStorm * (yRatio) * 10.;
	x += anchor.y * blendStorm * (1.-splash);

	float y = yRatio * height + anchor.y * size.y * (1.-splash);

	pos.x = x;
	pos.y = y;


	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);

	float aspect = resolution.y / resolution.x;
	gl_Position.x += anchor.x * size.x * aspect;

	gl_Position.x += anchor.x * .8*(.8+.2*rnd) * splashRatio * blendRain;
	gl_Position.y += anchor.y * .6*(.8+.2*rnd) * splashRatio * blendRain;
}