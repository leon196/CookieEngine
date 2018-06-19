
varying vec2 vAnchor;
varying vec3 vTangent;

void main () {
	gl_FragColor = vec4(normalize(vTangent)*.5+.5, 1);
}