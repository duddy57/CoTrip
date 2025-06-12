<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		icon: string;
		title: string;
		description: string;
		foo?: () => void;
	}

	let { icon, title, description, foo }: Props = $props();
	let cardElement: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (foo) {
							foo();
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (cardElement) {
			observer.observe(cardElement);
		}

		return () => observer.disconnect();
	});
</script>

<div bind:this={cardElement} class="h-full">
	<div
		class="group h-full rounded-2xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
		in:fly={{ y: 50, duration: 600 }}
	>
		<div class="mb-6 text-6xl transition-transform duration-300 group-hover:scale-110">
			{@html icon}
		</div>
		<h3 class="mb-4 text-2xl font-bold text-gray-800">{title}</h3>
		<p class="leading-relaxed text-gray-600">{description}</p>
	</div>
</div>
