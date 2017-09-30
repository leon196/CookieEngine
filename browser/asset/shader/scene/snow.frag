
uniform sampler2D uTexture;
uniform float time;
uniform float blendStorm;
uniform float blendHeat;
uniform float blendBurnOut;
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying vec2 vSpotTarget;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
varying vec4 vPosScreen;

vec3 red1 = vec3(01, 0.898, 0.478);
vec3 red2 = vec3(0.733, 0.160, 0.105);

void main()	{

	float len = length(vAnchor);
	len += (1.-clamp(length(vPos)*.07,0.,1.))*blendHeat;
	if (len> 0.45) discard;
	vec2 uv = vTexcoord;
	vec4 color = vec4(1);
	float shade = 1.-clamp(length(vAnchor)*.05, 0., 1.);
	// shade *= mix(1.-clamp(length(vSpotTarget)*.01, 0., 1.), 1., blendStorm);
	float light = 0.;
	light += mix(1.-clamp(length(vSpotTarget)/mix(length(cameraPosition)*8.,200., blendStorm), 0., 1.), 1., blendStorm);
	// light += mix(1.-clamp(length(vSpotTarget.x)/mix(20.,200., blendStorm), 0., 1.), 1., blendStorm);
	// light += mix(1.-clamp(length(vSpotTarget.y)/mix(10.,200., blendStorm), 0., 1.), 1., blendStorm);
	shade *= clamp(light,0.,1.);
	shade = smoothstep(.9,1.,shade);
	// shade *= 1.-clamp(length(vPos.xz)*.005,0.,1.);
	color.rgb *= shade;
	color.rgb *= .9 + .1 * rand(vAnchor);

	// burn
	color.rgb *= 1.-blendHeat;
	vec2 target = 1.6*normalize(-vPosScreen.xy)*length(vPosScreen.xy);
	float radius = .4;
	float range = .3;
	// color.rgb = clamp(color.rgb+blendHeat*10.*(1.-smoothstep(.5,.6,length(vPos)*.1)), 0.,1.);
	// color.rgb = mix(color.rgb, red2, blendHeat * step(radius,length(vAnchor+target)));
	// color.rgb = mix(color.rgb, red1, blendHeat * step(radius+range,length(vAnchor+target)));


	// storm
	float a = atan(vPos.z, vPos.x);
	float r = length(vPos.xz);
	shade = sin(r+a+time*10.)*.5+.5;
	shade = smoothstep(.0,.5,shade);
	color.rgb *= mix(1.,shade, blendStorm);


	gl_FragColor = color;
}