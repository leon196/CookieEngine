
varying vec3 vNormal, vView;

void main () {
	vec3 color = vec3(0,1,0);
	vec3 view = normalize(vView);
	float ddot = dot(normalize(vNormal), view);
	// color = mix(vec3(0,1,0), color, step(ddot, 0.));
	float shade = ddot*.5+.5;
	// shade = pow(shade, 1./2.2);
	color *= shade;
	gl_FragColor = vec4(color, 1);
}