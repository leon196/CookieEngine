
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform float blendLine;
uniform vec2 resolution;

varying float vSeed;
varying vec3 vView;
varying vec3 vDirection;
varying vec3 vNormal;
varying vec2 vAnchor;
varying float vDepth;


vec3 displace (vec3 pos, float ratio) {
  vec3 p = pos;

  // displace
  float dist = length(p);
  vec3 offset = vec3(noiseIQ(pos));
  float a = noiseIQ(pos)*PI2;
  offset.xz = vec2(cos(a),sin(a));
  offset.xz *= rot(ratio * PI2 + dist + time);
  offset.xy *= rot(ratio * PI2 + dist + time);
  p += offset * 5.;

  // expansion animation
  float range = 40.;
  dist = mod(length(p.xyz)/range*10.+time*.5+ratio, 1.);
  dist *= range;
  p.xyz = normalize(p.xyz)*(dist);

  return p;
}
void main()  {

  vAnchor = anchor;
  float a = indexMap.y * PI2;
  vec3 pos = vec3(cos(a),sin(a), indexMap.x*2.-1.);
  vec2 size = vec2(.2) * blendLine;
  vec2 aspect = vec2(resolution.y / resolution.x, 1.);
  float ratio = mod(rand(pos.xz) + anchor.y/2., 1.);

  // find out neighbors
  float delta = .001;
  vec3 prev = displace(pos, mod(ratio+1.-delta, 1.));
  vec3 next = displace(pos, mod(ratio+delta, 1.));

  // directions vectors
  vec3 up = normalize(-pos);
  vDirection = normalize(next-prev);
  vNormal = cross(vDirection, up);

  // displace it
  pos = displace(pos, ratio);

  vDepth = length(cameraPosition - pos);
  vView = normalize(cameraPosition - pos);

  // pos it
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);

	// spread quad on screenspace
  gl_Position.x += anchor.x * aspect.x * size.x;
  gl_Position.y += anchor.y * aspect.y * size.y;
}
