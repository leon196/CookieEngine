
uniform sampler2D frameScene;
uniform sampler2D frameTunnel;
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
	vec4 scene = texture2D(frameScene, vUv);
	vec4 tunnel = texture2D(frameTunnel, vUv);
	// vec4 background = vec4(vPos*.5+.5, 1.);
	vec4 background = vec4(.2);

	vec4 frame = mix(scene, tunnel, 1.);

	vec2 uv = vUv*2.-1.;
	uv.x *= resolution.x / resolution.y;
	// uv.x += sin(uv.y*3.+time)*.05;
	// background *= 1.-smoothstep(.3, .4, length(mod(uv*20.,1.)-.5));
	// background = vec4(1.)*luminance(background.rgb);
	frame = mix(background, frame, frame.a);

	// vignette
	float vignette = sin(vUv.x * PI);
	vignette *= sin(vUv.y * PI);
	frame.rgb *= smoothstep(-.3,.3,vignette);

	gl_FragColor = frame;
	// gl_FragColor = texture2D(ribbonText, vUv);
}
