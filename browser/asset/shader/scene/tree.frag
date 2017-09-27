
uniform sampler2D uTexture;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vDir;
varying vec3 vDirCamera;
varying vec3 vColor;

void main()	{
	vec2 uv = vTexcoord;
	// vec4 color = texture2D(uTexture, uv.xy);
	// vec4 color = vec4(vDir*.5+.5,1);
	vec4 color = vec4(vColor, 1);
	float shade = dot(-normalize(vDir), normalize(vDirCamera))*.5+.5;
	color.rgb *= .5+.5*shade;
	// color.rg = uv;
	// if (color.a < 0.1) discard;
	gl_FragColor = color;
}