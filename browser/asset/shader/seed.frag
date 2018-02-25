
uniform sampler2D dataTexture, framebuffer;
uniform float time;
varying vec2 vUv;

void main () {
	vec3 position = texture2D(dataTexture, vUv).xyz;
	position.y += sin(time + position.x * 3.) * .1;
	gl_FragColor = vec4(position, 1);
}