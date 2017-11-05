
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vIndexMap;
varying vec2 vAnchor;
varying vec2 vPosScreen;

const vec3 green1 = vec3(0.235, 0.623, 0.368);
const vec3 green2 = vec3(0.180, 0.380, 0.160);
const vec3 brown = vec3(0.835, 0.745, 0.423);
const vec3 blue1 = vec3(0.521, 0.772, 0.898);
const vec3 blue2 = vec3(0.117, 0.415, 0.701);

void main()	{

	if (length(vAnchor) > 1.) discard;
	// gl_FragColor = vec4(fract(abs(vIndexMap)), 0., 1);
	// gl_FragColor = vec4(vAnchor*.5+.5,0,1);
	// gl_FragColor = vec4(normalize(vNormal)*.5+.5, 1);
	float a = atan(vAnchor.y, vAnchor.x);
	float r = length(vAnchor);
	float noisy = fbm(vec3(vAnchor, r*r*r)*2.+vPos*30., vec3(time)*.5);
	vec4 color = vec4(1.);
	float dist = length(vAnchor);//-vec2(0,.75));
	float shade = 1.;
	shade *= 1.-clamp(abs(vPosScreen.x)/4.,0.,1.);
	shade *= 1.-clamp(abs(vPosScreen.y)/4.,0.,1.);
	// shade *= clamp(dist,0.,1.)*.5+.5;
	// shade *= (1.-dist)*.5+.5;
	// shade -= noisy;
	float c = step(.5, rand(vIndexMap));
	vec3 color1 = mix(blue1, green1, c);
	vec3 color2 = mix(blue2, green2, c);
	color.rgb = mix(color1, color2, smoothstep(.3,.7,noisy));
	// color.rgb = mix(color.rgb, green2, smoothstep(.4,.45,noisy));
	// color.rgb = mix(color.rgb, green2, smoothstep(.3,.7,noisy));

	color.rgb *= .2+.8*shade;
	gl_FragColor = color;
}