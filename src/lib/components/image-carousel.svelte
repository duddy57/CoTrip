<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import beach from '$lib/assets/beach.jpg';
	import mountain from '$lib/assets/mountain.jpg';
	import city from '$lib/assets/city.jpg';
	import Autoplay from 'embla-carousel-autoplay';

	const images = [
		{
			src: beach,
			alt: 'Praia paradisíaca com águas cristalinas',
			title: 'Descubra Praias Paradisíacas',
			subtitle: 'Relaxe em destinos tropicais únicos'
		},
		{
			src: mountain,
			alt: 'Montanhas majestosas cobertas de neve',
			title: 'Explore Montanhas Majestosas',
			subtitle: 'Aventure-se em paisagens deslumbrantes'
		},
		{
			src: city,
			alt: 'Visite cidades famosas',
			title: 'Visite Cidades Famosas',
			subtitle: 'Mergulhe na cultura, realize compras e aproveite a gastronomia local'
		}
	];

	let currentIndex = $state(0);
	let timer: number;

	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function goToImage(index: number) {
		currentIndex = index;
	}

	onMount(() => {
		timer = setInterval(nextImage, 6000);

		return () => {
			clearInterval(timer);
		};
	});
</script>

<div class="relative w-full overflow-hidden">
	<Carousel.Root
		plugins={[
			Autoplay({
				delay: 10000
			})
		]}
		class="w-full"
	>
		<Carousel.Content class="relative ml-0 h-full w-full">
			{#each images as image, i}
				<Carousel.Item class="relative h-full w-full pl-0">
					<img src={image.src} alt={image.alt} class="h-full w-full object-cover" />
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Next />
		<Carousel.Previous />
	</Carousel.Root>
</div>
