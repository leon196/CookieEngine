
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVelocity;
varying vec3 vViewDir;
varying float vFade;
uniform sampler2D positionTexture;
uniform float blendFire;

vec3 brown = vec3(0.729, 0.564, 0.411);
vec3 green = vec3(0.411, 0.729, 0.596);

void main()	{
	if (length(vAnchor) > 0.45) discard;
	vec4 color = vec4(1);
	// color.a = vFade*.05*blendFire;
	// float ratio = rand(vTexcoord);
	float ratio = dot(normalize(vViewDir), normalize(vVelocity))*.5+.5;
	color.rgb = mix(vec3(01, 0.898, 0.478), vec3(0.733, 0.160, 0.105), smoothstep(.1,.9,ratio));
	// color = texture2D(positionTexture, vAnchor);
	// color.rgb = green * noiseIQ(vTexcoord.xxy*4.);
	// color.rgb *= 1.-clamp(length(vAnchor), 0., 1.);
	gl_FragColor = color;
}