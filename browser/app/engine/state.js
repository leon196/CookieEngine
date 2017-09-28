import { clamp } from '../libs/misc';

export default class {
	constructor() {
		this.current = 0;
		this.next = 0;
		this.ratio = 1;
	}

	update(dt) {
		if (this.current != this.next) {
			if (this.ratio > 0.) {
				this.ratio -= dt;
			} else {
				this.current = this.next;
			}
		} else {
			if (this.ratio < 1.) {
				this.ratio += dt;
			}
		}
		this.ratio = clamp(this.ratio, 0., 1.);
	}

	set(a, b) {
		this.current = a;
		this.next = b;
	}
}
