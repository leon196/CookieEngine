
uniform float time;
uniform sampler2D ribbonText;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vSeed;

void main()	{
	float shade = abs(dot(normalize(cameraPosition - vPosition), normalize(vNormal)));
	vec2 uv = vUv;
	uv.y -= .5;
	uv.y *= 1.5+sin(floor(uv.x)+mix(-time,time,step(.5,rand(vec2(vSeed)))))*.5;
	uv.y += .5;
	vec4 color = texture2D(ribbonText, uv);
	float lum = luminance(color.rgb);
	if (lum > .5) discard;
	gl_FragColor = vec4(vec3(shade), 1.);
}
