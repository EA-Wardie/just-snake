<script lang="ts">
	import { Coordinates, Direction, Segment } from '$lib';

	const cellSize = 32;
	const columns = innerWidth / cellSize;
	const rows = innerHeight / cellSize;
	const startX = Math.floor(columns / 2);
	const startY = Math.floor(rows / 2);

	let snake = $state([
		new Segment(startX, startY),
		new Segment(startX, startY + 1),
		new Segment(startX, startY + 2),
		new Segment(startX, startY + 3),
	]);

	let gameIndex = $state(0);

	let interval: number;

	const move = () => {
		snake.forEach((segment) => segment.move());
	};

	const setSegmentDirection = (segment: Segment, direction: Direction) => {
		segment.setDirection(direction);
	};

	const getSegmentColor = (index: number) => {
		return index === 0 ? 'bg-amber-600' : 'bg-primary';
	};

	const getSegmentRadius = (index: number) => {
		const segment = snake[index];
		const isHead = index === 0;
		const isTail = index === snake.length - 1;

		if (segment.getDirection() === Direction.UP && isHead) {
			return 'rounded-t-2xl rounded-b-md';
		} else if (segment.getDirection() === Direction.RIGHT && isHead) {
			return 'rounded-r-2xl rounded-l-md';
		}

		return 'rounded-md';
	};

	const initGameLoop = () => {
		let segmentIndex = 0;

		clearInterval(interval);

		interval = setInterval(() => {
			if (gameIndex < 10) {
				if (gameIndex > 3 && segmentIndex < snake.length) {
					setSegmentDirection(snake[segmentIndex], Direction.RIGHT);
					segmentIndex++;
				} else {
					segmentIndex = 0;
				}

				gameIndex++;

				move();
			} else {
				clearInterval(interval);
			}
		}, 500);
	};

	initGameLoop();
</script>

<section class="relative h-full w-full border-8 border-neutral-600 text-white">
	{#each snake as segment, index}
		<div
			class="absolute aspect-square transition-all duration-100 {getSegmentColor(
				index,
			)} {getSegmentRadius(index)}"
			style="width: {cellSize}px; left: {segment.getX() * cellSize}px; top: {segment.getY() *
				cellSize}px"
		></div>
	{/each}
</section>
