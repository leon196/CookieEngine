
uniform float time, normalMode;
varying vec3 vHeight;

float getHeightNormalized (vec3 pos) {
	return fbm5(pos.xzy * .2, 0., vec3(0,0,0));
}

float getHeight (vec3 pos) {
	float d = length(uv-.5) * 100.;
	float fade = clamp(d / 10., 0., 1.);
	float far = smoothstep(10., 40., d);
	return getHeightNormalized(pos) * 3. * fade + far * 8.;
}

void displace (inout vec3 p) {
	p.y += getHeight(p.xyz);
}

void main () {
	vec4 pos = modelMatrix * vec4(position, 1.);

	if (normalMode == 1.) {
		vec2 e = vec2(.1,0);
		vec3 north = pos.xyz + e.yyx;
		vec3 south = pos.xyz - e.yyx;
		vec3 east = pos.xyz + e.xyy;
		vec3 west = pos.xyz - e.xyy;
		displace(north);
		displace(south);
		displace(east);
		displace(west);
		vHeight.xyz = cross(west - east, north - south);
		// vHeight.xyz = normalize(vHeight.xyz);
	} else {
		vHeight.x = getHeightNormalized(pos.xyz);
		vHeight.y = getHeight(pos.xyz);
	}

	gl_Position = vec4(uv * 2. - 1., 0., 1.);
}