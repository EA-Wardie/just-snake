<script lang="ts">
	const snake = $state([
		[16, 11],
		[16, 12],
		[16, 13],
		[16, 14],
		[16, 15],
	]);

	const isSnakePart = (index: number) => {
		return snake.some((part) => part.includes(index));
	};
</script>

<section class="mx-auto grid aspect-square h-full grid-cols-32">
	{#each { length: 32 * 32 }, index}
		<div class="border border-white bg-{isSnakePart(index) ? 'white' : ''}"></div>
	{/each}
</section>
