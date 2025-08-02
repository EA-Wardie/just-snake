<script lang="ts">
	import { Direction, Food, Segment } from '$lib';

	const aspectRatio = innerWidth / innerHeight;
	const columns = innerWidth > 1920 ? 50 : innerWidth < 720 ? 16 : 30;
	const rows = Math.floor(columns / aspectRatio);
	const cell = Math.floor(innerWidth / columns);

	let interval: number | undefined;
	let gameHasStarted = $state<boolean>(false);
	let gameIsOver = $state<boolean>(false);
	let snake = $state<Segment[]>([]);
	let food = $state<Food[]>([]);

	const getHighScore = () => {
		return localStorage.getItem('highScore') || '0';
	};

	const updateHighScore = () => {
		localStorage.setItem('highScore', (snake.length * 10).toString());
	};

	const getSegmentColor = (index: number) => {
		if (index === 0) {
			return 'bg-amber-600';
		}

		return index % 2 === 0 ? 'bg-primary' : 'bg-lime-500';
	};

	const isInBounds = () => {
		const head = snake.at(0);

		return (
			head && head.getX() > -1 && head.getY() > -1 && head.getX() < columns && head.getY() < rows
		);
	};

	const isOnFood = () => {
		return snake.some(
			(segment) =>
				`${segment.getX()}_${segment.getY()}` === `${food.at(0)?.getX()}_${food.at(0)?.getY()}`,
		);
	};

	const moveSnake = () => {
		const head = snake.at(0);

		if (head) {
			const x = head.getX();
			const y = head.getY();
			const direction = head.getDirection();

			switch (direction) {
				case Direction.UP:
					snake.unshift(new Segment(x, y - 1, direction));
					break;
				case Direction.DOWN:
					snake.unshift(new Segment(x, y + 1, direction));
					break;
				case Direction.LEFT:
					snake.unshift(new Segment(x - 1, y, direction));
					break;
				case Direction.RIGHT:
					snake.unshift(new Segment(x + 1, y, direction));
					break;
			}
		}

		snake.pop();
	};

	const clearGameBoard = () => {
		snake = [];
		food = [];
	};

	const stopGameLoop = () => {
		clearInterval(interval);
		clearGameBoard();
	};

	const resetGame = () => {
		clearGameBoard();
		initSnake();
		createFood();
		startGameLoop();

		gameIsOver = false;
	};

	const initSnake = () => {
		const x = Math.floor(columns / 2);
		const y = Math.floor(rows / 2);

		for (let index = 0; index < 4; index++) {
			snake.push(new Segment(x, y + index));
		}
	};

	const removeFood = () => {
		food = [];
	};

	const feedSnake = () => {
		const tail = snake.at(-1);

		if (tail) {
			const x = tail.getX();
			const y = tail.getY();
			const direction = tail.getDirection();

			switch (direction) {
				case Direction.UP:
					snake.push(new Segment(x, y + 1, direction));
					break;
				case Direction.DOWN:
					snake.push(new Segment(x, y - 1, direction));
					break;
				case Direction.LEFT:
					snake.push(new Segment(x + 1, y, direction));
					break;
				case Direction.RIGHT:
					snake.push(new Segment(x - 1, y, direction));
					break;
			}
		}

		updateHighScore();
	};

	const createFood = () => {
		const random = Number(Math.random().toFixed(1));

		let x = Math.floor(columns * random);
		let y = Math.floor(rows * random);

		if (x === columns) {
			x -= 1;
		}

		if (y === rows) {
			y -= 1;
		}

		food.push(new Food(x, y));
	};

	const startGameLoop = () => {
		clearInterval(interval);

		interval = setInterval(() => {
			if (isInBounds()) {
				moveSnake();

				if (isOnFood()) {
					removeFood();
					feedSnake();
					createFood();
				}
			} else {
				stopGameLoop();

				gameIsOver = true;
			}
		}, 200);
	};

	const startGame = () => {
		initSnake();
		createFood();
		startGameLoop();

		gameHasStarted = true;
	};

	const updateDirectionInput = (event: KeyboardEvent) => {
		const head = snake.at(0);

		if (head) {
			const direction = head.getDirection();

			switch (event.key) {
				case 'ArrowUp':
					if (direction !== Direction.DOWN) {
						snake.at(0)?.setDirection(Direction.UP);
					}

					break;
				case 'ArrowDown':
					if (direction !== Direction.UP) {
						snake.at(0)?.setDirection(Direction.DOWN);
					}

					break;
				case 'ArrowLeft':
					if (direction !== Direction.RIGHT) {
						snake.at(0)?.setDirection(Direction.LEFT);
					}

					break;
				case 'ArrowRight':
					if (direction !== Direction.LEFT) {
						snake.at(0)?.setDirection(Direction.RIGHT);
					}

					break;
			}
		}
	};

	const registerKeyboardEvents = () => {
		removeEventListener('keyup', updateDirectionInput);
		addEventListener('keyup', updateDirectionInput);
	};

	registerKeyboardEvents();
</script>

<section class="flex h-full w-full items-center justify-center bg-neutral-600">
	<div class="relative bg-neutral-950" style="width: {columns * cell}px; height: {rows * cell}px">
		{#each snake as segment, index}
			<div
				class="absolute aspect-square {getSegmentColor(index)}"
				style="width: {cell}px; left: {segment.getX() * cell}px; top: {segment.getY() * cell}px"
			></div>
		{/each}

		{#each food as foodItem}
			<div
				class="absolute aspect-square bg-rose-600"
				style="width: {cell}px; left: {foodItem.getX() * cell}px; top: {foodItem.getY() * cell}px"
			></div>
		{/each}
	</div>
</section>

{#if !gameHasStarted}
	<dialog
		class="fixed top-1/2 left-1/2 flex w-full max-w-xs -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-4 border-neutral-600 bg-neutral-900 p-6 text-center md:max-w-md"
	>
		<h1 class="text-3xl font-semibold text-white uppercase md:text-4xl">Just Snake</h1>
		<h2 class="mt-2 text-2xl text-white">Press <strong>PLAY</strong> to start playing!</h2>
		<h3 class="mt-4 text-xl text-white">High Score: {getHighScore()}</h3>
		<button class="mt-6 w-full bg-white px-4 py-2 font-semibold" onclick={() => startGame()}>
			PLAY
		</button>
	</dialog>
{/if}

{#if gameIsOver}
	<dialog
		class="fixed top-1/2 left-1/2 flex w-full max-w-xs -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-4 border-neutral-600 bg-neutral-900 p-6 text-center md:max-w-md"
	>
		<h1 class="text-3xl font-semibold text-white uppercase md:text-4xl">Game Over</h1>
		<h2 class="mt-2 text-2xl text-white">You have died!</h2>
		<h3 class="mt-4 text-xl text-white">Your Score: {getHighScore()}</h3>
		<button class="mt-6 w-full bg-white px-4 py-2 font-semibold" onclick={() => resetGame()}>
			TRY AGAIN
		</button>
	</dialog>
{/if}
