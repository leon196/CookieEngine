
uniform sampler2D frameBuffer;
uniform sampler2D uTexture;
uniform float fadeTransition;
uniform float blendLight;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	vec4 color = texture2D(frameBuffer, vUv);
	
	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	color.rgb *= smoothstep(-.3,.3,vignette);

	// inverse colors
	color = mix(color, 1.-color, blendLight);

	// label
	vec2 uvLabel = vUv;
	uvLabel -= .5;
	uvLabel.x *= resolution.x/resolution.y;
	uvLabel += .5;
	vec4 label = texture2D(uTexture, uvLabel);
	vec3 seed = uvLabel.xyy*10.;
	float noisy = fbm(seed*6., vec3(time))*noiseIQ(seed*3.);
	float ratio = -1.+blendLabelFire*2.+noisy;
	label.rgb *= (1.-smoothstep(.3,.7,ratio));
	label.rgb = mix(label.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	label.rgb = mix(label.rgb, vec3(01, 0.898, 0.478), smoothstep(.8,.9,ratio));
	label.a *= 1.-smoothstep(.9,.95,ratio);
	label.a *= blendLabelAlpha;

	color = mix(color, label, label.a);

	gl_FragColor = color;
}