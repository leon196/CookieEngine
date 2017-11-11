
uniform sampler2D jonathanTexture;
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;

void main()	{
	vec3 color = vec3(1);
	float shade = dot(vNormal, vView) * .5 + .5;
	// float lod = 8.;
	// color *= ceil(shade*lod)/lod;
	color *= shade;

	gl_FragColor = vec4(color, 1);
}
