
varying vec2 vUv;
varying vec2 vAnchor;
varying vec2 vIndexMap;
varying vec3 vDir;
varying vec3 vNormal;
varying vec3 vView;

void main()	{
	vec3 color = vec3(1);
	// color = vec3(fract(abs(vAnchor*.5+.5)), 0);
	color = vDir * .5 + .5;
	// float shade = dot(-vView, vNormal) * .5 + .5;
	// color *= shade;
	gl_FragColor = vec4(color, 0);
}
