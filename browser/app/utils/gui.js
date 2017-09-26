import * as dat from 'dataarts/dat.gui/build/dat.gui.js';

import { parameter } from '../editor/parameter';

export const gui = new dat.gui.GUI();

gui.remember(parameter);
Object.keys(parameter).forEach(key => {
	const item = gui.add(parameter, key);
	const name = key.toLowerCase();
	if (
		name.indexOf('blend') !== -1 ||
		name.indexOf('range') !== -1 ||
		name.indexOf('ratio') !== -1 ||
		name.indexOf('damping') !== -1
	) {
		item.min(0).max(1).step(0.01);
	}
	gui.close();
});
