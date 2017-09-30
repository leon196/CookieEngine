
uniform sampler2D frameBuffer;
uniform sampler2D uTextureTitle;
uniform sampler2D uTextureDate;
uniform float fadeTransition;
uniform float blendLight;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
uniform float blendHeat;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(frameBuffer, vUv);

	float aspect = resolution.x/resolution.y;
	
	// vignette
	float vignette = sin(vUv.x * PI);
	color.rgb *= smoothstep(-.3,.6,vignette);
	color.rgb *= smoothstep(0.,.1/aspect,vignette);
	vignette = sin(vUv.y * PI);
	color.rgb *= smoothstep(-.3,.6,vignette);
	color.rgb *= smoothstep(0.,.1,vignette);

	// inverse colors
	color = mix(color, 1.-color, blendLight);

	// label
	vec2 uvLabel = vUv;
	uvLabel -= .5;
	uvLabel.x *= aspect;
	uvLabel += .5;
	vec2 uvDate = uvLabel;
	uvDate.y += .2;
	vec4 label = texture2D(uTextureTitle, uvLabel) + texture2D(uTextureDate, uvDate);
	vec3 seed = uvLabel.xyy*10.;
	float noisy = fbm(seed*4., vec3(time));//*noiseIQ(seed*3.);
	// float ratio = -1.+blendLabelFire*2.+noisy;
	// ratio = sin(time*.3+noisy)*.5+.5;
	float ratio = mix(0., noisy+1., blendHeat);
	// ratio = smoothstep(0.1,1.,ratio);
	// label.rgb *= ratio;
	label.rgb *= (1.-ratio);
	vec3 c = vec3(0.733, 0.160, 0.105);
	// vec3 c = mix(vec3(0.733, 0.160, 0.105), vec3(01, 0.898, 0.478), rand(seed.xy)*.2+.4);
	label.rgb = mix(label.rgb, c*(1.-ratio), smoothstep(.6,.7,ratio));
	label.rgb = mix(label.rgb, vec3(0), smoothstep(.8,.9,ratio));
	// label.a *= 1.-smoothstep(.9,.95,ratio);
	// label.a *= blendLabelAlpha;

	color = mix(color, label, label.a);

	gl_FragColor = color;
}