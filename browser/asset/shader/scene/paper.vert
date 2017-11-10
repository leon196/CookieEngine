
attribute vec2 anchor;
attribute vec2 indexMap;

uniform float time;
uniform float blendPaper;
uniform vec2 resolution;

varying vec3 vView;
varying vec3 vNormal;
varying float vDepth;
varying vec2 vAnchor;

vec3 displace (vec3 pos, float ratio) {
  vec3 p = pos;
  float dist = length(p);
  vec3 offset = vec3(noiseIQ(pos));
  float a = noiseIQ(pos)*PI2;
  offset.xz = vec2(cos(a),sin(a));
  offset.xz *= rot(ratio * PI2 + time);
  offset.xy *= rot(ratio * PI2 + time);
  p += offset;
  p.xy *= rot(ratio + time + p.z*.2);
  return p;
}

void main()  {
  vec2 size = vec2(1.);
  vec3 pos = position;

  float a = indexMap.y * PI2;
  pos.xy = vec2(cos(a),sin(a));
  pos.z = (indexMap.x*2.-1.)*10.;

  float ratio = mod(rand(pos.xy) + anchor.y/5., 1.);

  float delta = .001;
  vec3 prev = displace(pos, mod(ratio+1.-delta, 1.));
  vec3 next = displace(pos, mod(ratio+delta, 1.));
  vec3 up = normalize(-pos);
  vec3 direction = normalize(next-prev);
  vNormal = cross(direction, up);
  pos = displace(pos, ratio);

  pos.xy *= 2.;
  size *= blendPaper;
  pos += direction *  size.y;
  pos += vNormal * anchor.x * size.x;
  pos += up * anchor.x * 2.;

  vAnchor = anchor;

  vDepth = length(cameraPosition - pos);
  vView = normalize(cameraPosition - pos);

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}
