
varying vec3 vNormal, vView, vColor;

void main () {
	vec3 color = vColor;//vec3(0,1,0);
	vec3 view = normalize(vView);
	float ddot = dot(normalize(vNormal), -view);
	// color = mix(vec3(0,1,0), color, step(ddot, 0.));
	float shade = ddot*.5+.5;
	// float shade = clamp(ddot, 0., 1.);
	shade = pow(shade, 1./2.2);
	color *= shade*.8+.2;
	// color = mix(color, vec3(1), 1.-shade);
	gl_FragColor = vec4(color, 1);
}