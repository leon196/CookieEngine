
uniform sampler2D frameScene, frameRaymarch, frameText;
uniform float blendTextIn, blendTextOut, blendGlitch;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main ()	{
	vec2 uv = vUv;

	// scanline glitch
	uv.x += (rand(uv.yy)*2.-1.)*blendGlitch * smoothstep(.5*(1.-blendGlitch),1.,noiseIQ(uv.yyy*10.+time*blendGlitch));

	// frames
	vec4 scene = texture2D(frameScene, uv);
	vec4 raymarch = texture2D(frameRaymarch, uv);
	vec4 text = texture2D(frameText, uv);

	// blend raymarch and meshes
	float depthScene = scene.a;
	depthScene += 1000. * (1.-depthScene) * step(depthScene, .01);
	gl_FragColor = mix(scene, raymarch, step(raymarch.a, depthScene));

	// blend meshes with grayscale
	float lum = luminance(scene.rgb);
	gl_FragColor = mix(gl_FragColor, raymarch, 1.-lum);

	// shade background for better reading
	float textShadow = .5+ .5*clamp(length(uv.y-.5)*2., 0., 1.);
	textShadow = mix(1., textShadow, blendTextIn);
	textShadow = mix(textShadow, 1., blendTextOut);
	gl_FragColor *= textShadow;

	// add text
	gl_FragColor = mix(gl_FragColor, text, text.a);
}
