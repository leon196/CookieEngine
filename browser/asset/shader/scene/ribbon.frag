
uniform float time;
uniform sampler2D ribbonText;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main()	{
	float shade = abs(dot(normalize(cameraPosition - vPosition), normalize(vNormal)));
	vec4 color = texture2D(ribbonText, vUv);
	float lum = luminance(color.rgb);
	if (lum > .5) discard;
	gl_FragColor = vec4(vec3(shade), 1.);
}
