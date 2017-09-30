
varying vec2 vAnchor;
varying float vShade;

vec3 green1 = vec3(0.356, 0.843, 0.235);
vec3 green2 = vec3(0.274, 0.635, 0.184);
vec3 red1 = vec3(0.827, 0.133, 0.133);
vec3 yellow1 = vec3(0.964, 0.850, 0.396);
vec3 blue1 = vec3(0.396, 0.654, 0.964);
vec3 purple1 = vec3(0.686, 0.239, 0.819);

void main ()	{
	float blendType = smoothstep(.8,1.,vShade);
	vec2 uv = vAnchor;
	uv.x *= mix(.5,.75,blendType);
	uv.y = mix(uv.y, -uv.y, blendType);
	float heart = cos((abs(uv.x)+.2)*PI)*.2;
	// heart += (1.-clamp(abs(uv.x)*10.,0.,1.))*.2;
	heart += (1.-clamp(sin(abs(uv.x)*8.),0.,1.))*.2;
	uv.y += heart * blendType;

	float leaf = clamp(uv.y,0.,1.);
	uv.y += .5 * (1.-blendType);
	float len = length(uv);
	len += abs(uv.x)-.1 * (1.-blendType);
	if (len > 0.45) discard;
	
	float shade = sin(vShade*20.)*.5+.5;
	vec3 green = mix(green1, green2, shade);
	vec3 yellow = mix(yellow1, red1, shade);
	vec3 red = mix(purple1, red1, shade);
	vec3 color = mix(green, red, blendType);

	// edge
	shade = 1.-smoothstep(.0, .8, clamp(len,0.,1.));
	// shade = mix(shade, 1.,blendType);
	// middle x
	shade *= mix(1.-clamp(.1/(abs(uv.x)+.2),0.,1.), 1., blendType);
	color.rgb *= .5+.5*shade;

	gl_FragColor = vec4(color,1);
}