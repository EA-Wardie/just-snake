<script lang="ts">
	import Arrow from '../components/Arrow.svelte';

	type Direction = 'up' | 'down' | 'left' | 'right';
	type Coordinates = { x: number; y: number };

	const totalRows = innerWidth > 720 ? 32 : 22;
	const totalCols = innerWidth > 720 ? 32 : 22;

	let direction = $state<Direction>('up');
	let snake = $state<string[]>([]);
	let food = $state<string[]>([]);
	let gameInterval: number;
	let intervalTiming = 400;
	let gameStarted = $state(false);
	let isGameOver = $state(false);

	const getHighScore = () => {
		return localStorage.getItem('highScore') || '0';
	};

	const getSegmentColor = (position: string) => {
		console.log(snake.at(0), position);
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

	const isOutOfBounds = (segment: string) => {
		return (
			segment.includes('-1') ||
			segment.includes(totalCols.toString()) ||
			segment.includes(totalRows.toString())
		);
	};

	const makeSegment = (coordinates: Coordinates) => {
		if (direction === 'up') {
			return `${coordinates.x}_${coordinates.y - 1}`;
		} else if (direction === 'down') {
			return `${coordinates.x}_${coordinates.y + 1}`;
		} else if (direction === 'left') {
			return `${coordinates.x - 1}_${coordinates.y}`;
		} else if (direction === 'right') {
			return `${coordinates.x + 1}_${coordinates.y}`;
		}

		return '0_0';
	};

	const killGame = () => {
		clearInterval(gameInterval);

		localStorage.setItem('highScore', (snake.length * 10).toString());

		snake = [];
		food = [];
		isGameOver = true;
	};

	const checkGameState = (segment: string) => {
		if (snake.includes(segment) || isOutOfBounds(segment)) {
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

			if (intervalTiming > 75) {
				intervalTiming -= 25;
			}

			initGameLoop();
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
		const randomXCoordinate = Math.floor(Math.random() * totalCols);
		const randomYCoordinate = Math.floor(Math.random() * totalRows);
		const foodSegment = `${randomXCoordinate}_${randomYCoordinate}`;

		if (snake.includes(foodSegment)) {
			generateFood();

			return;
		}

		food.push(foodSegment);
	};

	const resetGame = () => {
		snake = ['16_11', '16_12', '16_13', '16_14'];
		direction = 'up';
		intervalTiming = 400;
		isGameOver = false;

		initGameLoop();
		generateFood();
	};

	const initGameLoop = () => {
		clearInterval(gameInterval);

		gameInterval = setInterval(() => {
			moveSnake();
		}, intervalTiming);
	};

	const startGame = () => {
		snake = ['16_14', '16_15', '16_16', '16_17'];
		gameStarted = true;

		initGameLoop();
		generateFood();
		registerKeyboardEvents();
	};
</script>

<section
	class="flex h-full items-center justify-between max-md:flex-col max-md:p-4 md:justify-center"
>
	<div class="h-fit w-full max-w-4xl border-4 border-white/15">
		{#each { length: totalRows }, rowIndex}
			<div class="flex w-full">
				{#each { length: totalCols }, colIndex}
					<div class="aspect-square p-0.5" style="width: {100 / totalCols}%;">
						<div
							id="{rowIndex}_{colIndex}"
							class="size-full transition-colors duration-150 {getSegmentColor(
								`${colIndex}_${rowIndex}`,
							)}"
						></div>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-3 gap-2 border-4 border-white/15 p-4 md:hidden">
		<div></div>
		<button
			class="flex size-10 items-center justify-center border-4 border-white/15 font-semibold transition-colors duration-75 active:bg-white/20"
			onclick={() => (direction = 'up')}
		>
			<Arrow class="size-8 -rotate-90 text-white" />
		</button>
		<div></div>

		<button
			class="flex size-10 items-center justify-center border-4 border-white/15 font-semibold transition-colors duration-75 active:bg-white/20"
			onclick={() => (direction = 'left')}
		>
			<Arrow class="size-8 rotate-180 text-white" />
		</button>
		<button
			class="flex size-10 items-center justify-center border-4 border-white/15 font-semibold transition-colors duration-75 active:bg-white/20"
			onclick={() => (direction = 'down')}
		>
			<Arrow class="size-8 rotate-90 text-white" />
		</button>
		<button
			class="flex size-10 items-center justify-center border-4 border-white/15 font-semibold transition-colors duration-75 active:bg-white/20"
			onclick={() => (direction = 'right')}
		>
			<Arrow class="size-8 text-white" />
		</button>
	</div>
</section>

{#if isGameOver}
	<dialog
		id="gameOverDialog"
		class="fixed top-1/2 left-1/2 flex w-full max-w-xs -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-4 border-white/20 bg-neutral-900 px-6 pt-5 pb-6 text-center md:max-w-xl"
	>
		<h1 class="text-3xl font-semibold text-white md:text-4xl">Game Over</h1>
		<h2 class="text-2xl text-white">You have died!</h2>
		<h3 class="mt-4 text-xl text-white">You Score: {getHighScore()}</h3>
		<button class="mt-4 bg-white px-3 py-1 font-semibold" onclick={() => resetGame()}>
			Try Again!
		</button>
	</dialog>
{/if}

{#if !gameStarted}
	<dialog
		id="startGameDialog"
		class="fixed top-1/2 left-1/2 flex w-full max-w-xs -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-4 border-white/20 bg-neutral-900 px-6 pt-5 pb-6 text-center md:max-w-xl"
	>
		<h1 class="text-3xl font-semibold text-white md:text-4xl">Just Snake</h1>
		<h2 class="text-2xl text-white">Press PLAY to start playing!</h2>
		<h3 class="mt-4 text-xl text-white">High Score: {getHighScore()}</h3>
		<button class="mt-4 bg-white px-3 py-1 font-semibold" onclick={() => startGame()}>
			Play!
		</button>
	</dialog>
{/if}
