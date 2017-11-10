
uniform float time;
uniform float blendText;

varying float vFadeOut;
varying vec2 vAnchor;

void main()	{
	if (length(vAnchor+.5) > 0.5) discard;
	gl_FragColor = vec4(vec3(1), (1.-vFadeOut) * blendText);
}
