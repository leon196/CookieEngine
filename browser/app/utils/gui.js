import * as dat from 'dataarts/dat.gui/build/dat.gui.js';

import { parameters } from '../editor/parameters';

export const gui = new dat.gui.GUI();

gui.remember(parameters);
Object.keys(parameters).forEach(key => {
	const item = gui.add(parameters, key);
	const name = key.toLowerCase();
	if (
		name.indexOf('blend') !== -1 ||
		name.indexOf('range') !== -1 ||
		name.indexOf('ratio') !== -1 ||
		name.indexOf('damping') !== -1
	) {
		item.min(0).max(1).step(0.01);
	}
});
