
uniform float time;
uniform sampler2D jonathanSprite;
varying vec2 vUv;
varying vec2 vAnchor;

void main()	{
	vec2 uv =  vAnchor*.4+.35;
	uv *= 2.;
	vec4 sprite = texture2D(jonathanSprite, uv);
	if (sprite.a < .5) discard;
	gl_FragColor = sprite;
}
