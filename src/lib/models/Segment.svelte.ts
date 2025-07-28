import { Direction } from '$lib/enums/Direction';
import { Coordinates } from './Coordinates';

export class Segment {
	// private coordinates: Coordinates;
	private x: number;
	private y: number;
	private direction: Direction;

	// constructor(coordinates: Coordinates, direction: Direction = Direction.UP) {
	// 	this.coordinates = $state(coordinates);
	// 	this.direction = $state(direction);
	// }

	constructor(x: number, y: number, direction: Direction = Direction.UP) {
		this.x = $state(x);
		this.y = $state(y);
		this.direction = $state(direction);
	}

	// public move() {
	// 	switch (this.direction) {
	// 		case Direction.UP:
	// 			this.coordinates.setY(this.coordinates.getY() - 1);
	// 			break;
	// 		case Direction.DOWN:
	// 			this.coordinates.setY(this.coordinates.getY() + 1);
	// 			break;
	// 		case Direction.LEFT:
	// 			this.coordinates.setX(this.coordinates.getX() - 1);
	// 			break;
	// 		case Direction.RIGHT:
	// 			this.coordinates.setX(this.coordinates.getX() + 1);
	// 			break;
	// 	}
	// }
	//
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

	// public setCoordinates(coordinates: Coordinates) {
	// 	this.coordinates = coordinates;
	// }

	// public setX(x: number) {
	// 	this.coordinates = new Coordinates(x, this.coordinates.getY());
	// }

	// public setY(y: number) {
	// 	this.coordinates = new Coordinates(this.coordinates.getX(), y);
	// }

	public setDirection(direction: Direction) {
		this.direction = direction;
	}

	// public getCoordinates() {
	// 	return this.coordinates;
	// }

	// public getX() {
	// 	return this.coordinates.getX();
	// }

	public getX() {
		return this.x;
	}

	// public getY() {
	// 	return this.coordinates.getY();
	// }

	public getY() {
		return this.y;
	}

	public getDirection() {
		return this.direction;
	}
}
