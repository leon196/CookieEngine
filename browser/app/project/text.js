
import * as THREE from 'three.js';
import * as makeText from '../engine/make-text';
import assets from '../engine/assets';

var texture = makeText.createTexture([
	{
		text: 'From Brain\nWith Love',
		font: 'bowlbyonesc',
		textAlign: 'center',
		fontSize: 150,
		fillStyle: 'white',
		textBaseline: 'middle',
		width: 1024,
		height: 1024,
		shadowColor: 'rgba(0,0,0,.5)',
		shadowBlur: 4,
		offsetY: -100,
	},
	{
		text: 'music by Grizzly Cogs\nart coded by ponk\ndev tool by Koltes',
		fontSize: 70,
		offsetY: 200,
	},
]);

export default texture;
