
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
	uv.x = mix(abs(uv.x-.3), uv.x, blendType);
	if (length(uv) > 0.45) discard;
	
	float shade = sin(vShade*20.)*.5+.5;
	vec3 green = mix(green1, green2, shade);
	vec3 yellow = mix(yellow1, red1, shade);
	vec3 blue = mix(blue1, purple1, shade);
	vec3 color = mix(green, blue, blendType);

	gl_FragColor = vec4(color,1);
}