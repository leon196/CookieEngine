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
	color.a = luminance(color.rgb);
	// vec4 color = vec4(1);
	// color.rgb = normalize(vNormal) * .5 + .5;
	// float shade = dot(-normalize(vViewDir), normalize(vNormal))*.5+.5;
	// color.rgb *= shade;
	// color.rg = uv;
	vec3 vPos = vec3(vUv.xyy)*10.;
	float noisy = fbm(vPos*6., vec3(time))*noiseIQ(vPos*3.);
	// noisy = mod(noisy + time, 1.);
	// noisy += sin(time);
	float ratio = -1.+blendLabelFire*2.+noisy;
	// float ratio = blendLabelFire*noisy;
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.8,.9,ratio));
	// if (ratio > 0.6) discard;
	color.a *= 1.-smoothstep(.9,.95,ratio);
	color.a *= blendLabelAlpha;
	gl_FragColor = color;
}