import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from '../project/parameters';
import composer from '../project/composer';

export const gui = new dat.gui.GUI();

gui.remember(parameters);

Object.keys(parameters).forEach(keyRoot => {
	var folder = gui.addFolder(keyRoot);
	var keys = Object.keys(parameters[keyRoot]);
	if (keys.length > 0) {
		keys.forEach(key => {
			const param = parameters[keyRoot][key];
			const item = folder.add(parameters[keyRoot], key);
			const type = typeof(param);
			if (type == 'number') {
				item.step(0.01);
			} else if (type == 'boolean' && keyRoot == 'Scene') {
				var index = keys.indexOf(item.property);
				item.onChange(function(value) {
					composer.toggle(index, value);
				});
			}
		});
	} else {
	}
	// folder.open();
});
gui.close();
