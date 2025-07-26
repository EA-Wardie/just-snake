<script lang="ts">
	type Direction = 'up' | 'down' | 'left' | 'right';
	type Coordinates = { x: number; y: number };

	const totalRows = innerWidth > 720 ? 32 : 22;
	const totalCols = innerWidth > 720 ? 32 : 22;

	let direction = $state<Direction>('up');
	let snake = $state<string[]>(['16_11', '16_12', '16_13', '16_14']);
	let food = $state<string[]>([]);
	let gameInterval: number;
	let intervalTiming = 500;
	let isGameOver = $state(false);

	const getSegmentColor = (position: string) => {
		if (snake.at(0) === position) {
			return 'bg-amber-600';
		}

		if (snake.includes(position)) {
			return 'bg-primary';
		}

		if (food.includes(position)) {
			return 'bg-rose-600';
		}

		return 'bg-neutral-950';
	};

	const isOutOfBounds = (direction: Direction, coordinates: Coordinates) => {
		return (
			(direction === 'up' && coordinates.y === 0) ||
			(direction === 'down' && coordinates.y === totalRows - 1) ||
			(direction === 'left' && coordinates.x === 0) ||
			(direction === 'right' && coordinates.x === totalCols - 1)
		);
	};

	const makeSegment = (coordinates: Coordinates) => {
		if (direction === 'up') {
			return !isOutOfBounds(direction, coordinates)
				? `${coordinates.x}_${coordinates.y - 1}`
				: `${coordinates.x}_${totalRows - 1}`;
		} else if (direction === 'down') {
			return !isOutOfBounds(direction, coordinates)
				? `${coordinates.x}_${coordinates.y + 1}`
				: `${coordinates.x}_${0}`;
		} else if (direction === 'left') {
			return !isOutOfBounds(direction, coordinates)
				? `${coordinates.x - 1}_${coordinates.y}`
				: `${totalCols - 1}_${coordinates.y}`;
		} else if (direction === 'right') {
			return !isOutOfBounds(direction, coordinates)
				? `${coordinates.x + 1}_${coordinates.y}`
				: `${0}_${coordinates.y}`;
		}

		return '0_0';
	};

	const killGame = () => {
		clearInterval(gameInterval);
		isGameOver = true;
	};

	const checkGameState = (segment: string) => {
		if (snake.includes(segment)) {
			killGame();
		}
	};

	const removeFood = (foodIndex: number) => {
		food.splice(foodIndex, 1);
	};

	const didEat = (segment: string) => {
		const foodIndex = food.findIndex((food) => food === segment);

		if (foodIndex !== -1) {
			removeFood(foodIndex);

			return true;
		}

		return false;
	};

	const getCoordinates = (segment: string) => {
		const segmentCoordinates = segment.split('_');

		return {
			x: Number(segmentCoordinates.at(0)),
			y: Number(segmentCoordinates.at(1)),
		};
	};

	const updateSnake = (segment: string) => {
		snake.pop();
		snake.unshift(segment);

		if (didEat(segment)) {
			const tailSegment = snake.at(-1) || '0_0';
			const tailCoordinates = getCoordinates(tailSegment);

			if (direction === 'up') {
				snake.push(`${tailCoordinates.x}_${tailCoordinates.y + 1}`);
			}

			if (direction === 'down') {
				snake.push(`${tailCoordinates.x}_${tailCoordinates.y - 1}`);
			}

			if (direction === 'left') {
				snake.push(`${tailCoordinates.x + 1}_${tailCoordinates.y}`);
			}

			if (direction === 'right') {
				snake.push(`${tailCoordinates.x - 1}_${tailCoordinates.y}`);
			}

			if (intervalTiming > 100) {
				intervalTiming -= 25;
			}

			startGameLoop();
			generateFood();
		}
	};

	const moveSnake = () => {
		const segment = snake.at(0) || '0_0';
		const coordinates = getCoordinates(segment);
		const newSegment = makeSegment(coordinates);

		checkGameState(newSegment);
		updateSnake(newSegment);
	};

	const updateDirection = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowUp':
				if (direction !== 'down') {
					direction = 'up';
				}

				break;
			case 'ArrowDown':
				if (direction !== 'up') {
					direction = 'down';
				}

				break;
			case 'ArrowLeft':
				if (direction !== 'right') {
					direction = 'left';
				}

				break;
			case 'ArrowRight':
				if (direction !== 'left') {
					direction = 'right';
				}

				break;
		}
	};

	const registerKeyboardEvents = () => {
		removeEventListener('keyup', updateDirection);
		addEventListener('keyup', updateDirection);
	};

	const generateFood = () => {
		const randomXCoordinate = Math.floor(Math.random() * (totalCols + 1));
		const randomYCoordinate = Math.floor(Math.random() * (totalRows + 1));
		const foodSegment = `${randomXCoordinate}_${randomYCoordinate}`;

		if (snake.includes(foodSegment)) {
			generateFood();
		}

		food.push(foodSegment);
	};

	const resetGame = () => {
		snake = ['16_11', '16_12', '16_13', '16_14'];
		direction = 'up';
		isGameOver = false;

		startGameLoop();
	};

	const startGameLoop = () => {
		clearInterval(gameInterval);

		gameInterval = setInterval(() => {
			moveSnake();
		}, intervalTiming);
	};

	startGameLoop();
	generateFood();
	registerKeyboardEvents();
</script>

<section class="flex h-full items-center justify-center max-md:px-4">
	<div class="w-full max-w-4xl rounded-lg border border-white/15">
		{#each { length: totalRows }, rowIndex}
			<div class="flex w-full">
				{#each { length: totalCols }, colIndex}
					<div class="aspect-square border-white/15 p-0.5" style="width: {100 / totalCols}%;">
						<div
							id="{rowIndex}_{colIndex}"
							class="size-full rounded-lg {getSegmentColor(`${colIndex}_${rowIndex}`)}"
						></div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>

{#if isGameOver}
	<dialog
		id="gameOverDialog"
		class="fixed top-1/2 left-1/2 flex h-64 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl bg-neutral-900 p-6 text-center"
	>
		<h1 class="text-4xl font-semibold text-white">Game Over</h1>
		<h2 class="text-2xl text-white">You have died!</h2>
		<h3 class="mt-4 text-xl text-white">You Score: {snake.length * 10}</h3>
		<button class="mt-4 rounded-lg bg-white px-4 py-2 font-semibold" onclick={() => resetGame()}>
			Try Again!
		</button>
	</dialog>
{/if}
