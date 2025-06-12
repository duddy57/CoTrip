<script lang="ts">
	import ImageCarousel from '$lib/components/image-carousel.svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowDown } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	let scrollY = $state(0);
	let innerHeight = $state(0);

	// Melhor controle do scroll
	let isFormVisible = $state(false);
	let heroOffset = $state(0);

	function scrollToForm() {
		const nextSection = document.querySelector('#about-section');
		if (nextSection) {
			nextSection.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	}

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
			isFormVisible = scrollY > 300;
			heroOffset = Math.max(0, scrollY * 0.5);
		};

		const handleResize = () => {
			innerHeight = window.innerHeight;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="relative">
	<div class="fixed top-0 left-0 z-0 h-screen w-full">
		<div
			class="h-full w-full transition-transform duration-75 ease-out"
			style="transform: translateY({heroOffset}px)"
		>
			<ImageCarousel />
			<div
				class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"
			></div>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="max-w-4xl px-4 text-center text-white">
					<h1
						class="animate-fade-in-up mb-6 text-5xl font-bold drop-shadow-2xl md:text-7xl lg:text-8xl"
					>
						Planeje sua Viagem dos Sonhos
					</h1>
					<p
						class="animate-fade-in-up animation-delay-200 mb-4 text-xl opacity-90 drop-shadow-md md:text-3xl"
					>
						Acompanhado com amigos ou família
					</p>
					<p
						class="animate-fade-in-up animation-delay-400 mb-8 text-lg opacity-80 drop-shadow-md md:text-xl"
					>
						Organize tudo em poucos passos simples
					</p>
				</div>
			</div>
		</div>
	</div>

	{#if !isFormVisible}
		<div
			class="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 transform"
			transition:fade={{ duration: 300 }}
		>
			<Button
				variant="outline"
				class="rounded-full border-white/20 bg-white/90 px-8 py-4 text-gray-700 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/95 hover:shadow-xl"
				onclick={scrollToForm}
			>
				Planeje sua viagem em poucos passos
				<ArrowDown class="ml-2 h-5 w-5 animate-bounce text-emerald-600" />
			</Button>
		</div>
	{/if}

	<!-- Spacer para o conteúdo -->
	<div class="h-screen"></div>
</div>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 1s ease-out forwards;
	}

	.animation-delay-200 {
		animation-delay: 0.2s;
		opacity: 0;
	}

	.animation-delay-400 {
		animation-delay: 0.4s;
		opacity: 0;
	}
</style>
