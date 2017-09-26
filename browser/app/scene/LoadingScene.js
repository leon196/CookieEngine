
import * as THREE from 'three.js';

export function LoadingScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	this.camera.position.z = 5;

	this.geometry = new THREE.SphereBufferGeometry( 5, 5, 5 );
	this.wireframe = new THREE.WireframeGeometry( this.geometry );
	this.line = new THREE.LineSegments( this.wireframe );
	this.line.material.depthTest = false;
	this.line.material.opacity = 0.25;
	this.line.material.transparent = true;

	this.scene.add( this.line );

	this.update = function (time)
	{
		this.geometry.rotateX(time);
		this.geometry.rotateY(time*.5);
	}
}