
uniform sampler2D uTexture;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;

void main()	{
	vec2 uv = vTexcoord;
	// vec4 color = texture2D(uTexture, uv.xy);
	vec4 color = vec4(1);
	// color.rgb = vNormal * .5 +
	// color.rg = uv;
	// color.rgb *= abs(vWave);
	// if (color.a < 0.1) discard;
	gl_FragColor = color;
}