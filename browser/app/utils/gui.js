import * as dat from 'dataarts/dat.gui/build/dat.gui.js';

import { parameter } from '../editor/parameter';

export const gui = new dat.gui.GUI();

gui.remember(parameter);
Object.keys(parameter).forEach(keyRoot => {
	var folder = gui.addFolder(keyRoot);
	Object.keys(parameter[keyRoot]).forEach(key => {
		const item = folder.add(parameter[keyRoot], key);
		const name = key.toLowerCase();
		if (name.indexOf('blend') !== -1) {
			item.name(key.slice(5, key.length));
			item.min(0).max(1).step(0.01);
		}
		// gui.close();
	});
});
