
uniform float time;
attribute vec2 anchor, indexMap;
varying vec2 vAnchor;
varying vec3 vTangent;

vec3 getCurve (float ratio) {
	vec3 p = vec3(2);
	p.xz *= rot((ratio+time)*.3);
	p.yx *= rot((ratio+time)*.9);
	p.yz *= rot((ratio+time)*.6);
	return p;
}

vec3 getCurl (vec3 seed) {
	vec3 curl; 
	curl.x = noiseIQ(seed);
	curl.y = noiseIQ(seed+vec3(11.5013240, 5.134, 9.0329));
	curl.z = noiseIQ(seed+vec3(9.459,39.1239,15.0));
	curl = curl * 2. - 1.;
	// curl = normalize(curl);
	return curl;
}

void main () {
	float radius = .5;
	float salt = rand(indexMap);
	float y = anchor.y*.5+.5;
	float unit = .1;
	float current = y * 3. + salt * 10.;
	vec4 pos = modelMatrix * vec4(position, 1);
	pos.xyz = getCurl(pos.xyz * 100.) * 4.;
	pos.xyz += getCurve(current);
	float next = mod(current + unit, 1.);
	vec3 tan = (getCurve(next) - pos.xyz) / unit;
	vec3 right = normalize(cross(vec3(0,1,0), tan));
	right = (vec4(right,1) * rotationMatrix(tan, -anchor.x * PI)).xyz;
	pos.xyz += right * radius;
	gl_Position = projectionMatrix * viewMatrix * pos;
	vAnchor = anchor;
	vTangent = tan;
}