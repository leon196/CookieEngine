
export function State ()
{
	this.current = 0;
	this.next = 0;
	this.ratio = 1;

	this.update = function (dt)
	{
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
		this.ratio = Math.clamp(this.ratio, 0., 1.);
	}

	this.set = function (a, b)
	{
		this.current = a;
		this.next = b;
	}
}