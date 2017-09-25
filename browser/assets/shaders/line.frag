
uniform sampler2D uTexture;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
void main()	{
	vec2 uv = vTexcoord;
	// vec4 color = texture2D(uTexture, uv.xy);
	vec4 color = vec4(0);
	// color.rgb = vNormal * .5 +
	// color.rg = uv;
	// if (color.a < 0.1) discard;
	gl_FragColor = color;
}