import { Direction } from '$lib/enums/Direction';

export class Segment {
	private x: number;
	private y: number;
	private direction: Direction;

	constructor(x: number, y: number, direction: Direction = Direction.UP) {
		this.x = $state(x);
		this.y = $state(y);
		this.direction = $state(direction);
	}

	public getColor(index: number) {
		if (index === 0) {
			return 'bg-amber-600';
		}

		return index % 2 === 0 ? 'bg-primary' : 'bg-lime-500';
	}

	public move() {
		switch (this.direction) {
			case Direction.UP:
				this.y = this.y - 1;
				break;
			case Direction.DOWN:
				this.y = this.y + 1;
				break;
			case Direction.LEFT:
				this.x = this.x - 1;
				break;
			case Direction.RIGHT:
				this.x = this.x + 1;
				break;
		}
	}

	public setDirection(direction?: Direction) {
		if (direction) {
			this.direction = direction;
		}
	}

	public getX() {
		return this.x;
	}

	public getY() {
		return this.y;
	}

	public getDirection() {
		return this.direction;
	}
}
