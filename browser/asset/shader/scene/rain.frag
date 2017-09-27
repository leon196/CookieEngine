
uniform sampler2D uTexture;
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying float vWave;
varying vec3 vNormal;

void main()	{
	if (length(vAnchor) > 0.45) discard;
	vec2 uv = vTexcoord;
	vec4 color = vec4(1);
	color.rgb *= 1.-clamp(length(vAnchor+vec2(0.,-.25))/2., 0., 1.);
	gl_FragColor = color;
}