
attribute float number;
attribute float type;
attribute float count;
uniform float time;
uniform float timeScaled, OpenDoor;
uniform vec3 cameraPos;

varying vec2 vUv;
varying vec3 vPos;
varying vec4 vColor;

void main()	{
	vUv = uv;
	vec3 pos = position;
	// pos.x += number;
	float range = 200.;
	float speed = 5. / range;

	float isCable = step(abs(type-4.), .1);
	float isDoor = step(abs(type-5.), .1);
	pos.yz *= rot(mix(0., PI/2., isCable));
	pos.y -= cos(pos.z*PI)*isCable;
	pos.y += 6. * isCable;
	pos.z *= mix(1., 2. * range / count, isCable);
	pos.z += isCable * range / count;

	float ratio = mod(number / count - timeScaled * speed, 1.);
	pos.z += range * (ratio * 2. - 1.) * (1.-isDoor);

	pos.z += range * isDoor * .5;
	// pos.x += cos(pos.z*.05-timeScaled)*4.;

	vPos = pos;

	vec3 view = normalize(cameraPos-pos);
	float shade = mix(1., step(.9,abs(dot(normalize(normal), view))), isDoor);
	vColor = vec4(shade);
	// vColor = mix(vColor, vec4(normal*.5+.5, 1.), isDoor);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.);
}
