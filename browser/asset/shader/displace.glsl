
// vec4 displace (vec4 pos, float time)
// {
// 	float wave = sin(time + pos.x) * .5 + .5;
// 	wave = noiseIQ(pos.xyz * .4 + time);
// 	// pos.y += wave;
// 	return pos;
// }

// vec4 layer (vec4 pos, vec2 resolution, float index)
// {
// 	vec2 aspect = vec2(resolution.y/resolution.x, 1.);
// 	pos.x = pos.x * aspect.x;
// 	pos.y = pos.y * aspect.y;
// 	pos.z = index;
// 	return pos;
// }

// vec3 displace (vec3 pos, float t)
// {
// 	float wave = sin(t + pos.x) * .5 + .5;
// 	wave = noiseIQ(pos.xxx *.5 + t);
// 	pos.y *= wave * 10.;
// 	float a = -pos.x * .8;
// 	float radius = 4. + sin(pos.y * .5 + t);
// 	pos.x = cos(a + t) * radius;
// 	pos.y += a * .5;
// 	pos.z = sin(a + t) * radius;
// 	return pos;
// }
vec3 displaceTree (vec3 p, float t, float blend)
{
    float a = noiseIQ(p/3.)*PI2;
    float intensity = .15*clamp(p.y*.2,0.,1.);
    p.z += sin(a + t * 3.)*intensity;
    p.z += cos(a + t * 3.)*intensity;

    float speed = 3.;
    intensity = 1.5*clamp(p.y*.1,0.,1.) * blend;
    p.x += cos(t * speed) * intensity;
    p.z += sin(t * speed) * intensity;
    return p;
}
