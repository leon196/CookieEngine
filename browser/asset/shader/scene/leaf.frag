
uniform sampler2D uTexture;
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying float vWave;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vRatio;
varying float vAngle;

vec3 green1 = vec3(0.356, 0.843, 0.235);
vec3 green2 = vec3(0.274, 0.635, 0.184);

void main()	{
	if (length(vAnchor) > 0.45) discard;
	vec2 uv = vTexcoord;
	// vec4 color = vec4(1,1,1,.05*rand(vAnchor)*(1.-vRatio));
	// float shade = dot(normalize(vViewDir), normalize(vNormal))*.5+.5;
	vec3 color = mix(green1, green2, sin(vAngle)*.5+.5);
	// color.rgb *= 1.-clamp(length(vAnchor+vec2(0.,-.25))/2., 0., 1.);
	gl_FragColor = vec4(color,1);
}