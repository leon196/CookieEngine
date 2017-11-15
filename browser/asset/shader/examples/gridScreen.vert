
uniform float time;
uniform vec2 resolution;
uniform sampler2D opticalFlowTexture;
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
	vUv = anchor*.5+.5;
	vAnchor = anchor;
	vIndexMap = indexMap;
	vSeed = position;

	vec3 pos = position;
	pos.xy = indexMap*2.-1.;

	vec2 flow = texture2D(opticalFlowTexture, indexMap).xy;
	vColor = vec4(1);
	vec2 size = vec2(.05*length(flow));
	gl_Position = vec4(pos.xy, 0., 1.);
	gl_Position.xy += anchor * aspect * size;

	// vec2 size = vec2(.01,.05*length(flow));
	vColor = vec4(hsv2rgb(vec3(atan(flow.y,flow.x),.8,.8)), 1);
	// vec2 front = -normalize(flow) * size.y;
	// vec2 right = vec2(front.y, -front.x) * size.x;
	// gl_Position.xy += front * (anchor.y-1.) * aspect;
	// gl_Position.xy += right * anchor.x * aspect;
}
