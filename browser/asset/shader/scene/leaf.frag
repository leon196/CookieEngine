
varying vec2 vAnchor;
varying float vShade;

vec3 green1 = vec3(0.356, 0.843, 0.235);
vec3 green2 = vec3(0.274, 0.635, 0.184);
vec3 red1 = vec3(0.827, 0.133, 0.133);
vec3 yellow1 = vec3(0.964, 0.850, 0.396);

void main ()	{
	if (length(vAnchor) > 0.45) discard;
	
	float shade = sin(vShade*20.)*.5+.5;
	vec3 red = mix(green1, green2, shade);
	vec3 yellow = mix(yellow1, red1, shade);
	vec3 color = mix(red, yellow, smoothstep(.7,.9,vShade));

	gl_FragColor = vec4(color,1);
}