
uniform sampler2D frameBuffer;
uniform sampler2D uTexture;
uniform sampler2D ribbonText;
uniform float fadeTransition;
uniform float blendLight;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec3 vPos;

void main ()	{
	vec4 frame = texture2D(frameBuffer, vUv);
	vec4 background = vec4(vPos*.5+.5, 1.);
	// background = vec4(1.)*luminance(background.rgb);
	vec4 color = mix(background, frame, frame.a);

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	color.rgb *= smoothstep(-.3,.3,vignette);

	gl_FragColor = color;
	// gl_FragColor = texture2D(ribbonText, vUv);
}
