
uniform sampler2D uTexture;
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying float vWave;
varying vec3 vNormal;

void main()	{
	if (length(vAnchor) > 0.45) discard;
	vec2 uv = vTexcoord;
	vec4 color = vec4(1);
	gl_FragColor = color;
}