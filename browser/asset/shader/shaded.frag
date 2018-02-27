
varying vec3 vNormal, vView, vColor;
varying vec2 vUv;

void main () {
	vec3 color = vColor;
	vec3 view = normalize(vView);
	float ddot = dot(normalize(vNormal), view);
	float shade = ddot*.5+.5;
	// color *= shade;
	shade = sin(vUv.x * PI);
	shade = pow(shade, 1./2.2);
	color *= shade*.5+.5;
	color *= shade;
	gl_FragColor = vec4(color, 1);
}