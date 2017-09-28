
attribute vec2 anchor;
attribute vec2 texcoord;
attribute vec3 lineEnd;
uniform vec2 resolution;
uniform float time;
uniform float blendRain;
uniform float blendStorm;
uniform float dimension;
varying vec2 vTexcoord;
varying float vWave;
varying vec3 vNormal;
varying vec2 vDirScreen;
varying vec2 vAnchor;

void main()	{
	vTexcoord = uv;
	vNormal = normal;
	vAnchor = anchor;
	float x = position.x*.5+.5;
	float y = position.y*.5+.5;
	vec2 seed = vec2(x,y);
	float index = x * dimension + y * dimension * dimension;
	float range = 20.;
	float height = 20.;
	vec2 size = vec2(.02,3.);
	size *= blendRain;
	float speed = 8. + 30. * noiseIQ(vec3(seed*100.,0.));
	vec3 pos = position;
	pos.x = (x*2.-1.) * range;
	pos.y = mod(rand(seed)*height*2.-time*speed, height);
	float yRatio = pos.y / height;
	pos.x += blendStorm * (yRatio) * 10.;
	pos.z = (y*2.-1.) * range;
	pos.y += anchor.y * size.y;// * rand(seed);
	pos.x += anchor.y * blendStorm;
	vec4 posScreenA = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
	// vec4 posScreenB = projectionMatrix * viewMatrix * modelMatrix * vec4(pos+vec3(0,size,0),1);
	gl_Position = posScreenA;
	vec2 pivot = anchor;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	gl_Position.x += pivot.x * aspect.x * size.x;
	// gl_Position.y += pivot.y * aspect.y * size * 4.;
	// gl_Position.x = mix(gl_Position.x, posScreenB.x, clamp(anchor.x,0.,1.));
	// gl_Position.y = mix(gl_Position.y, posScreenB.y, clamp(anchor.y,0.,1.));
}