
attribute vec2 anchor;
attribute vec2 indexMap;
attribute vec3 color;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec2 vAnchor;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vView;

void main()	{
	vUv = uv;
	vAnchor = anchor;
	vColor = color;
	float size = .2;
	float range = 5.;
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);

	vNormal = normalize(normal);
	vNormal.xyz = vNormal.xzy;
	vec3 up = vec3(0,1,0);
	vec3 tangent = normalize(cross(up, vNormal));

	vec3 pos = position;
	pos *= range;
	pos += (vNormal * anchor.y + tangent * anchor.x) * size;
	vView = normalize(pos-cameraPosition);

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1);
}
