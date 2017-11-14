uniform sampler2D uTexture;
uniform float time;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
varying vec2 vUv;
varying float vWave;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vPos;

void main()	{
	vec4 color = texture2D(uTexture, vUv.xy);
	vec3 vPos = vec3(vUv.xyy)*10.;
	float noisy = fbm(vPos*6., vec3(time))*noiseIQ(vPos*3.);
	float ratio = -1.+blendLabelFire*2.+noisy;
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.8,.9,ratio));
	color.a *= 1.-smoothstep(.9,.95,ratio);
	color.a *= blendLabelAlpha;
	gl_FragColor = color;
}