import * as dat from 'dat.gui/build/dat.gui.js';
import parameters from './parameters';

export const gui = new dat.gui.GUI();

gui.remember(parameters);

Object.keys(parameters).forEach(keyRoot => {
	var folder = gui.addFolder(keyRoot);

	Object.keys(parameters[keyRoot]).forEach(key => {
		const item = folder.add(parameters[keyRoot], key);
		const name = key.toLowerCase();

		if (name.indexOf('blend') !== -1) {
			item.name(key.slice(5, key.length));
			item.min(0).max(1).step(0.01);
		}
	});

	gui.close();
});
