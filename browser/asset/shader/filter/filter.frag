
uniform sampler2D frame;
uniform sampler2D frameRay;
uniform sampler2D framePaint;
uniform sampler2D uTextureTitle;
uniform sampler2D uTextureDate;
uniform float fadeTransition;
uniform float blendPaintIn;
uniform float blendPaintOut;
uniform float blendLight;
uniform float blendGlitch;
uniform float blendLabelFire;
uniform float blendLabelAlpha;
uniform float blendHeat;
uniform float blendBlack;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main ()	{
	// vec2 uv = vUv;
	// uv.x += sin(uv.y*1000.+time*10.)*.001;
	// vec4 color = texture2D(frame, uv);
	// float aspect = resolution.x / resolution.y;
	// vec4 color = vec4(0.);
	// vec2 target = vec2(.5);
	// for (float i = 0.; i < 20.; ++i) {
	// 	vec2 u = uv;
	// 	vec2 p = vec2(0.);
	// 	float rnd = rand(vec2(i));
	// 	p.x = rand(vec2(i,0));
	// 	p.y = rand(vec2(0,i));
	// 	p = normalize(p-target)*mod(length(p-target)+time*.1,.5)+target;
	// 	float fade = 1.-clamp(length(p-target)*2.,0.,1.);
	// 	fade = sin(fade*PI);
	// 	float thin = 0.001+0.001*rnd;
	// 	float dist = length(u - p);
	// 	// u *= rot(rnd*PI2);
	// 	// p *= rot(rnd*PI2);
	// 	float cros = abs(u.x - p.x)*abs(u.y - p.y);
	// 	float intensity = 1000.+1000.*rnd;
	// 	float offset = .01+.9*rnd;
	// 	color.rgb += fade*thin/(dist*max(0.,cros*intensity+offset));

	// 	// u = uv;
	// 	u.y -= sin(length(u.x-p.x))*.75;
	// 	dist = length(u-p);
	// 	color.r += 1.-smoothstep(0.05,.1, (dist+.1*rnd)/fade);
	// }
	vec2 uv = vUv;
	uv.x += (rand(uv.yy)*2.-1.)*blendGlitch * smoothstep(.5*(1.-blendGlitch),1.,noiseIQ(uv.yyy*10.+time*blendGlitch));
	vec4 scene = texture2D(frame, uv);
	vec4 ray = texture2D(frameRay, uv);
	vec4 paint = texture2D(framePaint, uv);
	scene.a += 1000. * (1.-scene.a) * step(scene.a, .01);
	float lum = luminance(scene.rgb);
	// vec3 background = vec3(1.)*clamp(sin(uv.x*100.),0.,1.);
	// gl_FragColor = vec4(background, 1.);
	// gl_FragColor = mix(gl_FragColor, scene, scene.a);
	gl_FragColor = mix(scene, ray, step(ray.a, scene.a));
	gl_FragColor = mix(gl_FragColor, ray, 1.-lum);
	float textShadow = .5+ .5*clamp(length(uv.y-.5)*2., 0., 1.);
	textShadow = mix(1., textShadow, blendPaintIn);
	textShadow = mix(textShadow, 1., blendPaintOut);
	gl_FragColor *= textShadow;
	gl_FragColor = mix(gl_FragColor, paint, paint.a);
	// gl_FragColor *= blendBlack;
	// gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1./2.));
	// gl_FragColor = scene;
	// gl_FragColor += ray * step(ray.a, depth.r+20.);
	// ray = vec4(1)*fract(ray.a);
	// scene = vec4(1)*fract(depth);
	// gl_FragColor = texture2D(framePaint, vUv);
	// gl_FragColor = ray;
}
