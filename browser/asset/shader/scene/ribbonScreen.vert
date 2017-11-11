
attribute float seed;

uniform float time;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
	float speed = 4.;
	float side = position.x;
	float lengthRatio = position.y;
	vUv = vec2(side, lengthRatio*1.5);
	vUv.y = vUv.y*.5+.5;
	vec2 pos = vec2(side*2.-1., lengthRatio);
	pos.y /= 6.;
	pos.y += sin(pos.x*5.+time*speed)*.05;
	pos.y += sin(pos.x+time*speed*.1)*.5;
	gl_Position = vec4(pos, .01, 1);
}
