// import { Direction } from '$lib/enums/Direction';
// import type { Segment } from './Segment';

// export class Snake {
// 	private segments: Segment[];
// 	private direction: Direction;

// 	constructor(...segments: Segment[]) {
// 		this.segments = segments;
// 		this.direction = Direction.UP;
// 	}

// 	public addSegment(segment: Segment) {
// 		this.segments.push(segment);
// 	}

// 	public getSegments() {
// 		return this.segments;
// 	}

// 	public setDirection(direction: Direction) {
// 		this.direction = direction;
// 	}

// 	public getDirection() {
// 		return this.direction;
// 	}

// 	public move() {
// 		this.segments.forEach((segment) => segment.move());
// 	}

// 	public kill() {
// 		this.segments = [];
// 		this.direction = Direction.UP;
// 	}
// }
