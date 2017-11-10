
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform float blendBubble, blendBubble1;
uniform vec2 resolution;

varying vec2 vAnchor;
varying float vDepth;
varying float vShould;


void main()	{
	vAnchor = anchor;
	vec3 pos = position*2.-1.;
	vec2 size = vec2(.25);
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);

	// arrange points on a cylinder
	float a = indexMap.y*PI;
	pos.xy = vec2(cos(a),sin(a));
	pos.z = (indexMap.x*2.-1.)*10.;
	pos.z += atan(pos.x,pos.y)*.5;

	// animation
	float waveGrow = .1+.9*clamp(cos(pos.z*2.+time*.5), 0.,1.);

	// displacement
	float seed = noiseIQ(pos*2.);
	float dist = length(pos);
	vec3 offset = vec3(seed);
	a = noiseIQ(pos*5.)*PI2;
	offset.xz = vec2(cos(a),sin(a));
	offset.xz *= rot(time);
	offset.xy *= rot(time);
	pos += offset*.5*(.5 + waveB * .5)*waveGrow * blendBubble1;

	// translate and repeat
	pos.z = repeat(pos.z*2.+time*.5, TAU*2.);

	// twist it
	pos.xy *= rot(pos.z * waveGrow + time);

	// apparition animation
	size *= smoothstep(0., 10., pos.z + (blendBubble*2.-1.) * 10.);

	// bounce it
	float should = waveB * smoothstep(.6,1.,seed);
	vShould = step(.1, should);
	size *= 2. + 1. * seed + 20. * should;

	// sqeeze it
	pos.xy *= .8+.2*cos(abs(pos.z));

	// scale it
	pos *= 20.;

	// send depth to alpha channel
	vDepth = length(cameraPosition - pos);

	// pos it
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);

	// spread quad on screenspace
	gl_Position.x += anchor.x * aspect.x * size.x;
	gl_Position.y += anchor.y * aspect.y * size.y;
}
