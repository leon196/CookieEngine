
uniform sampler2D uTexture;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vDir;

vec3 red = vec3(0.580, 0, 0);

void main()	{
	vec2 uv = vTexcoord;
	// vec4 color = texture2D(uTexture, uv.xy);
	vec4 color = vec4(red,1);
	color.rgb *= dot(normalize(vDir), vec3(0,1,0));
	// color.rg = uv;
	// if (color.a < 0.1) discard;
	gl_FragColor = color;
}