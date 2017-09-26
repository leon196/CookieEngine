import { actions } from '../../asset/animations/scene';
import { blenderHTML5Animations } from './blender-html5-animations.min';

var Blender = function ()
{
	this.actions = new blenderHTML5Animations.ActionLibrary(actions);
	this.evaluate = function (matrix, actionName, time)
	{
		this.actions[actionName].toWorld(matrix.elements, time, blenderHTML5Animations.Action.RotationMode.EULER_XYZ);
	}
}