<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="h-dvh w-dvw overflow-hidden">
	{@render children()}
</main>
