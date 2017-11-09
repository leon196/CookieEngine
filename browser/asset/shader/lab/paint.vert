
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform vec2 resolution;
uniform sampler2D framePaint;

varying float vSeed;
varying vec3 vView;
varying vec2 vAnchor;
varying vec2 vUv;
varying float vDepth;
varying float vRatio;
varying float vDisp;

void main()	{
	vec2 size = vec2(15.)/resolution.y;
	vec2 uv = indexMap;
	float scale = 1.;
	uv = (uv-.5)*scale+.5;
	vUv = uv;
	// uv.x += sin(uv.y*5.+time)*.1;
	float lum = luminance(texture2D(framePaint, uv).rgb);
	size *= lum;
	// size *= clamp(lum*3.,0.,1.);
	// size *= smoothstep(.0,1.,lum);
	vAnchor = anchor;
	vec3 pos = vec3(indexMap*2.-1., 0.1);
	float seed = rand(pos.xy);
	float a = seed*PI2;
	float ratio = mod(pos.x*.2+time*.1, 1.);
	float disp = smoothstep(.5,.9,ratio);
	// float disp = clamp(sin(ratio*TAU), 0., 1.);
	float r = .5 * disp;
	vec2 offset = vec2(cos(a),sin(a))*r;
	// offset.y += disp*.2;
	pos.xy += offset;
	size *= 1.+2.*disp;
	size *= smoothstep(.0,.1,ratio)*smoothstep(.0,.1,1.-ratio);
	vSeed = seed;
	vRatio = ratio;
	vDisp = disp;
	vDepth = pos.z;
	// gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	pos.x *= aspect.x;
	gl_Position = vec4(pos, 1.);
	vec2 pivot = anchor;
	pivot *= rot(PI/4.);
	gl_Position.x += pivot.x * aspect.x * size.x;
	gl_Position.y += pivot.y * aspect.y * size.y;
}
