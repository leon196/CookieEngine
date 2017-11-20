
uniform sampler2D sceneTexture;
uniform sampler2D gridTexture;
uniform sampler2D opticalFlowTexture;
uniform sampler2D feedbackTexture;
uniform sampler2D lastFrameTexture;
uniform sampler2D fireVelocityTexture;
uniform sampler2D firePositionTexture;
uniform sampler2D arrowTexture;
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

	// layers
	vec4 color = vec4(0);
	vec4 scene = texture2D(sceneTexture, uv);
	vec4 loop = texture2D(feedbackTexture, uv);
	vec4 grid = texture2D(gridTexture, uv);
	vec4 arrow = texture2D(arrowTexture, uv);
	vec4 flow = texture2D(opticalFlowTexture, uv);
	color = mix(color, loop, loop.a);
	color = mix(color, scene, scene.a);
	color = mix(color, grid, grid.a);
	color = mix(color, arrow, arrow.a * OpticalFlowEnabled);
	// color = texture2D(firePositionTexture, uv);
	// color = texture2D(fireVelocityTexture, uv);

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	// color.rgb *= smoothstep(-.3,.3,vignette);

	// color = vec4(1) * abs(colorDistance(texture2D(lastFrameTexture, uv), texture2D(sceneTexture, uv)));

	gl_FragColor = color;
}
