
uniform sampler2D fireSceneTexture;
uniform sampler2D raymarchTexture;
uniform vec2 resolution;
uniform float time;
uniform float FilterGlitch, FilterPixel, OpticalFlowEnabled;
varying vec2 vUv;

void main ()	{
	vec2 uv = vUv;

	vec2 pixel = resolution/max(1.,FilterPixel);
	uv = ceil(uv*pixel)/pixel;

	float glitch = sin(uv.y*1000.)*smoothstep(.5,1.,noiseIQ(uv.yyy*5.+time));
	uv.x += glitch * FilterGlitch;

	vec4 scene = texture2D(fireSceneTexture, uv);
	vec4 raymarch = texture2D(raymarchTexture, uv);

	// layers
	vec4 color = vec4(0);
	color = scene;
	float depthScene = scene.a;
	depthScene += 1000. * (1.-depthScene) * step(depthScene, .01);
	color = mix(color, raymarch, step(raymarch.a, depthScene));

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);

	gl_FragColor = color;
}
