
import * as THREE from 'three.js';

export function LoadingScene (scene)
{
	this.geometry = new THREE.SphereBufferGeometry( 5, 5, 5 );
	this.wireframe = new THREE.WireframeGeometry( this.geometry );
	this.line = new THREE.LineSegments( this.wireframe );
	this.line.material.depthTest = false;
	this.line.material.opacity = 0.25;
	this.line.material.transparent = true;

	scene.add( this.line );

	this.update = function (time)
	{
		this.geometry.rotateX(time);
		this.geometry.rotateY(time*.5);
	}
}