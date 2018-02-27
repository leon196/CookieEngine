import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from './parameters';

export const gui = new dat.gui.GUI();
gui.remember(parameters);
Object.keys(parameters).forEach(key => {
	const param = parameters[key];
	const item = gui.add(parameters, key);
	const type = typeof(param);
	if (type == 'number') {
		item.step(0.01);
	}
});
