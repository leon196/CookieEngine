
uniform sampler2D sceneTexture;
uniform sampler2D paperSceneTexture;
uniform sampler2D skullSceneTexture;
uniform sampler2D buildingSceneTexture;
uniform sampler2D raymarchTexture;
uniform sampler2D textSceneTexture;
uniform sampler2D fftTexture;
uniform vec2 resolution;
uniform float time;
uniform float fadeBlack, Lock, TextVisible;
uniform float FilterGlitch, FilterPixel, OpticalFlowEnabled;
varying vec2 vUv;

float getDepth (float depth) {
	return depth += 1000. * (1.-depth) * (1.-smoothstep(0.0,.1,depth));
}

void main ()	{
	vec2 uv = vUv;

	vec2 pixel = resolution/max(1.,FilterPixel);
	uv = ceil(uv*pixel)/pixel;

	float glitch = sin(uv.y*1000.)*smoothstep(.5,1.,noiseIQ(uv.yyy*5.+time));
	uv.x += glitch * FilterGlitch;


	// uv.x += time*.2;
	// uv.x = mix(uv.x,1.-uv.x,step(1.,mod(uv.x, 2.)));
	// uv = abs(fract(uv));

	// vec4 color = texture2D(sceneTexture, uv);
	vec4 text = texture2D(textSceneTexture, uv);

	vec2 center = uv*2.-1.;
	center.x *= resolution.x/resolution.y;
	float fadeCenter = smoothstep(.5,1.,length(center));

	vec4 color = rgbOffset(sceneTexture, uv, resolution, 5.*fadeCenter);
	// color = mix(color, blur(sceneTexture, uv, resolution), fadeCenter);

	float lockRadius = .5;
	float lockSlope = .5;
	float lockSlopeHeight = 1.;
	// center.y -= lockRadius;
	float lock = step(length(center), lockRadius);
	lock += step(abs(center.x)+center.y*lockSlope, .1) * step(0., center.y+lockSlopeHeight) * step(center.y, 0.);
	lock = clamp(lock, 0., 1.);
	color = mix(color, 1.-color, lock * Lock);

	color = mix(color, text, text.a * TextVisible);

  // stole iq's vingette code
  color *= pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.1 );   

	color *= fadeBlack;

	gl_FragColor = color;
}
