
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform vec2 resolution;
uniform sampler2D framePaint;

varying float vSeed;
varying vec3 vView;
varying vec2 vAnchor;
varying float vDepth;

void main()	{
	vec2 size = vec2(.02);
	vec2 uv = indexMap;
	float scale = .75;
	uv = (uv-.5)*scale+.5;
	// uv.x += sin(uv.y*5.+time)*.1;
	float lum = luminance(texture2D(framePaint, uv).rgb);
	size *= lum;
	vAnchor = anchor;
	vec3 pos = vec3(indexMap*2.-1., 0.1);
	float seed = rand(pos.xy);
	float a = seed*PI2*.2;
	float ratio = mod(pos.x+time*.1, 1.);
	float disp = clamp(sin(ratio*TAU), 0., 1.);
	float r = .1 * disp;
	vec2 offset = vec2(cos(a),sin(a))*r;
	offset.y += disp*.2;
	pos.xy += offset;
	// size *= 1.+sin(ratio*PI)*.2;
	size *= smoothstep(.0,.1,ratio)*smoothstep(.0,.1,1.-ratio);
	vSeed = seed;
	vDepth = pos.z;
	// gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position = vec4(pos, 1.);
	gl_Position.x += anchor.x * aspect.x * size.x;
	gl_Position.y += anchor.y * aspect.y * size.y;
}
