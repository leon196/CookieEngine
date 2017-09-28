
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vVelocity;
varying float vFade;
uniform sampler2D positionTexture;
uniform float blendFire;

vec3 brown = vec3(0.729, 0.564, 0.411);
vec3 green = vec3(0.411, 0.729, 0.596);

void main()	{
	if (length(vAnchor) > 0.45) discard;
	vec4 color = vec4(1);
	color.a = vFade*.2*blendFire;
	// color = texture2D(positionTexture, vAnchor);
	// color.rgb = green * noiseIQ(vTexcoord.xxy*4.);
	// color.rgb *= 1.-clamp(length(vAnchor), 0., 1.);
	gl_FragColor = color;
}