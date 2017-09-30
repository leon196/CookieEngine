
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
	uvDate.y += .3;
	vec4 label = texture2D(uTextureTitle, uvLabel) + texture2D(uTextureDate, uvDate);
	vec3 seed = uvLabel.xyy*3.;
	float noisy = fbm(seed*8., vec3(time));
	float ratio = mix(0., noisy+1., blendHeat);
	ratio = smoothstep(.4,.6,ratio);
	label.rgb *= (1.-ratio);
	label.rgb = mix(label.rgb, vec3(0.733, 0.160, 0.105)*(1.-ratio), smoothstep(.6,.7,ratio));
	label.rgb = mix(label.rgb, vec3(0), smoothstep(.8,.9,ratio));

	color = mix(color, label, label.a);

	gl_FragColor = color;
}