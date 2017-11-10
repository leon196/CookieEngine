
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform float blendPaintIn;
uniform float blendPaintOut;
uniform vec2 resolution;
uniform sampler2D frame;
uniform sampler2D frameText;

varying float vSeed;
varying vec3 vView;
varying vec2 vAnchor;
varying vec2 vUv;
varying float vDepth;
varying float vRatio;
varying float vDisp;

void main()	{
	vec2 size = vec2(.025);
	vec2 uv = indexMap;
	float scale = 1.;
	uv = (uv-.5)*scale+.5;
	vUv = uv;
	// uv.x += sin(uv.y*5.+time)*.1;
	float lum = luminance(texture2D(frameText, uv).rgb);
	size *= clamp(lum*3., 0., 1.);
	// size *= clamp(lum*3.,0.,1.);
	// size *= smoothstep(.0,1.,lum);
	vAnchor = anchor;
	vec3 pos = vec3(indexMap*2.-1., 0.1+lum*.5);
	float seed = rand(pos.xy);
	pos.z -= seed*.5;
	float a = seed*PI2*5.;
	// float ratio = mod(pos.x*.2+time*.1, 1.);
	float ratio = smoothstep(0., 1., pos.x + (blendPaintIn*2.-1.)*2.);
	float disp = smoothstep(0., 1., pos.x + (blendPaintOut*2.-1.)*2.);
	// float disp = clamp(sin(ratio*TAU), 0., 1.);
	float r = .3 * disp;
	vec2 offset = vec2(cos(a),sin(a))*r;
	offset.y += sin(disp*PI)*.25;
	offset.y -= disp*.25;
	// offset.x += disp*.5;
	size *= .5+.5*seed;
	pos.xy += offset;
	vec2 pivot = anchor;
	float should = waveB * smoothstep(.9,1.,seed);
	// pos.z *= 1.-should;
	pivot *= rot(PI/4.);
	// pivot *= rot(mix(PI/4., atan(pos.y,pos.x), should));
	pos.xy += .5 * normalize(pos.xy) * should * ratio * (1.-disp);// * clamp(pivot.y, 0., 1.);
	// pos.xy += clamp(pivot.x-pivot.y,0.,1.)*.1;// * clamp(pivot.y, 0., 1.);
	size *= 1.+2.*disp+2.*waveB*should;
	size *= ratio;
	vSeed = seed;
	vRatio = ratio;
	vDisp = disp;
	vDepth = pos.z;
	pos.y += .02 * sin(pos.x*10.+time*2.);
	// gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	pos.x *= aspect.x;
	gl_Position = vec4(pos, .7);
	gl_Position.x += pivot.x * aspect.x * size.x;
	gl_Position.y += pivot.y * aspect.y * size.y;
}
