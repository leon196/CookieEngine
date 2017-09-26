
import * as THREE from 'three.js';

export function LoadingScene ()
{
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	this.camera.position.z = 10;

	var size = 5.;
	var geo = new THREE.SphereBufferGeometry( size, size, size );
	this.line = new THREE.LineSegments( new THREE.WireframeGeometry( geo ) );
	this.line.material.depthTest = false;
	this.line.material.opacity = 1.;
	this.line.material.transparent = true;

	this.scene.add( this.line );

	this.update = function (time)
	{
	}
}