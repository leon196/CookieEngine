
uniform float time;
uniform vec2 resolution;
uniform sampler2D MeshesScene;
attribute vec2 anchor;
attribute vec2 indexMap;
varying vec2 vUv;
varying vec3 vSeed;
varying vec2 vAnchor;
varying vec2 vIndexMap;
varying vec3 vDir;
varying vec3 vNormal;
varying vec4 vColor;

void main() {
	vec2 aspect = vec2(resolution.y / resolution.x, 1.);
	vec2 size = 2./resolution;
	vUv = anchor*.5+.5;
	vAnchor = anchor;
	vIndexMap = indexMap;
	vSeed = position;

	vec3 pos = position;
	pos.xy = indexMap*2.-1.;

	size *= 2.*luminance(texture2D(MeshesScene, indexMap).rgb);
	vColor = vec4(1);

	gl_Position = vec4(pos.xy, 0., 1.);
	gl_Position.xy += anchor * size * aspect;
}
