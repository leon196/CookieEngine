
uniform sampler2D dataTexture, framebuffer;
uniform float time, reset;
varying vec2 vUv;

void main () {
	vec3 spawn = texture2D(dataTexture, vUv).xyz;
	vec3 frame = texture2D(framebuffer, vUv).xyz;
	// float should = 
	// frame.y += sin(time + frame.x * 10.) * .001;// * should;
	frame = mix(frame, spawn, reset);
	gl_FragColor = vec4(frame, 1);
}