
uniform sampler2D fireSceneTexture;
uniform sampler2D paperSceneTexture;
uniform sampler2D raymarchTexture;
uniform vec2 resolution;
uniform float time;
uniform float fadeBlack;
uniform float FilterGlitch, FilterPixel, OpticalFlowEnabled;
varying vec2 vUv;

void main ()	{
	vec2 uv = vUv;

	vec2 pixel = resolution/max(1.,FilterPixel);
	uv = ceil(uv*pixel)/pixel;

	float glitch = sin(uv.y*1000.)*smoothstep(.5,1.,noiseIQ(uv.yyy*5.+time));
	uv.x += glitch * FilterGlitch;


	// uv.x += time*.2;
	// uv.x = mix(uv.x,1.-uv.x,step(1.,mod(uv.x, 2.)));
	// uv = abs(fract(uv));

	vec4 scene = texture2D(paperSceneTexture, uv);
	vec4 raymarch = texture2D(raymarchTexture, uv);

	// layers
	vec4 color = scene;
	float depthScene = scene.a;
	depthScene += 1000. * (1.-depthScene) * (1.-smoothstep(0.0,.5,depthScene));
	color = mix(color, raymarch, step(raymarch.a, depthScene));

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);

	color *= fadeBlack;

	gl_FragColor = color;
}
