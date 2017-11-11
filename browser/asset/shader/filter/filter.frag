
uniform sampler2D frameScene;
uniform sampler2D frameTunnel;
uniform sampler2D uTexture;
uniform sampler2D ribbonText;
uniform float sceneOpacity;
uniform float tunnelOpacity;
uniform float blendLight;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec3 vPos;

void main ()	{
	vec2 uv = vUv*2.-1.;
	uv.x *= resolution.x / resolution.y;

	vec4 scene = texture2D(frameScene, vUv);
	vec4 tunnel = texture2D(frameTunnel, vUv);

	vec4 frame = scene * sceneOpacity + tunnel * tunnelOpacity;

	vec4 tunnelBack = vec4(1.);
	vec2 p = uv;
	float angle = atan(p.y,p.x);

	float speed = 2.;
	float radius = length(p);
	vec2 scale = vec2(200., 10.);
	float seed = floor(angle/TAU*scale.x);
	tunnelBack *= smoothstep(.6, 1., sin((angle)*scale.x));
	tunnelBack *= smoothstep(-.1, .1, sin((radius+time*speed+seed)*scale.y));
	tunnelBack *= length(p)*.5;
	vec4 background = mix(background, tunnelBack, 1.);

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
