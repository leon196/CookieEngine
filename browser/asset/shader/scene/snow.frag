
uniform sampler2D uTexture;
uniform float blendHeat;
uniform float blendBurnOut;
varying vec2 vTexcoord;
varying vec2 vAnchor;
varying vec2 vSpotTarget;
varying float vWave;
varying vec3 vNormal;

void main()	{
	if (length(vAnchor) > 0.45) discard;
	vec2 uv = vTexcoord;
	vec4 color = vec4(1);
	float shade = 1.-clamp(length(vAnchor)*.05, 0., 1.);
	// shade *= 1.-clamp(length(vSpotTarget)*.01, 0., 1.);
	shade = smoothstep(.9,1.,shade);
	color.rgb *= shade;
	color.rgb *= .9 + .1 * rand(vAnchor);
	color.rgb *= mix(1.-blendHeat,1.,blendBurnOut);
	gl_FragColor = color;
}