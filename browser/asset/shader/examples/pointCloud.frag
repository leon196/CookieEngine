
varying vec2 vUv;
varying vec2 vAnchor;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vView;

void main()	{
	float len = length(vAnchor);
	if (len > 0.5) discard;
	vec4 color = vec4(vColor, 1);
	// float shade = dot(vView, vNormal) * .5 + .5;
	// color.rgb *= shade;
	gl_FragColor = color;
}
