<script lang="ts">
	import { Direction, Segment } from '$lib';

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

	let segmentIndex = 0;
	let interval: number;
	let directions: Direction[] = [];

	const getSegmentColor = (index: number) => {
		return index === 0 ? 'bg-amber-600' : 'bg-primary';
	};

	const isInBounds = () => {
		const head = snake.at(0);

		if (head) {
			return (
				head.getX() > -1 && head.getY() > -1 && head.getX() < columns - 1 && head.getY() < rows - 1
			);
		}

		return false;
	};

	const checkAndUpdateDirection = () => {
		const newDirection = directions.at(0);

		if (newDirection) {
			snake[segmentIndex].setDirection(directions[segmentIndex]);
			segmentIndex++;
		}

		if (segmentIndex === snake.length) {
			directions.shift();
			segmentIndex = 0;
		}
	};

	const moveSnake = () => {
		snake.forEach((segment) => segment.move());
	};

	const initGameLoop = () => {
		clearInterval(interval);

		interval = setInterval(() => {
			if (isInBounds()) {
				checkAndUpdateDirection();
				moveSnake();
			} else {
				clearInterval(interval);
			}
		}, 300);
	};

	initGameLoop();

	const updateDirectionInput = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowUp':
				if (directions.at(-1) !== Direction.DOWN) {
					directions.push(Direction.UP);
				}

				break;
			case 'ArrowDown':
				if (directions.at(-1) !== Direction.UP) {
					directions.push(Direction.DOWN);
				}

				break;
			case 'ArrowLeft':
				if (directions.at(-1) !== Direction.RIGHT) {
					directions.push(Direction.LEFT);
				}

				break;
			case 'ArrowRight':
				if (directions.at(-1) !== Direction.LEFT) {
					directions.push(Direction.RIGHT);
				}

				break;
		}
	};

	const registerKeyboardEvents = () => {
		removeEventListener('keyup', updateDirectionInput);
		addEventListener('keyup', updateDirectionInput);
	};

	registerKeyboardEvents();
</script>

<section class="relative h-full w-full border-8 border-neutral-600 text-white">
	{#each snake as segment, index}
		<div
			class="absolute aspect-square transition-all duration-100 {getSegmentColor(index)}"
			style="width: {cellSize}px; left: {segment.getX() * cellSize}px; top: {segment.getY() *
				cellSize}px"
		></div>
	{/each}
</section>
