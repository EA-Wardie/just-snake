export class Food {
	private x: number;
	private y: number;

	constructor(x: number, y: number) {
		this.x = $state(x);
		this.y = $state(y);
	}

	public getX() {
		return this.x;
	}

	public getY() {
		return this.y;
	}
}
