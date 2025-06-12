<script module>
	const features = [
		{
			icon: '🗺️',
			title: 'Planejamento Simples',
			description:
				'Defina seu destino e datas em poucos cliques. Nossa plataforma cuida de todo o resto para você.'
		},
		{
			icon: '👥',
			title: 'Gestão de Grupo',
			description:
				'Convide amigos e família facilmente. Todos recebem notificações automáticas por email.'
		},
		{
			icon: '💰',
			title: 'Divisão Justa de Gastos',
			description:
				'Compartilhe despesas de forma transparente e justa entre todos os participantes.'
		}
	];

	const steps = [
		{
			number: '01',
			title: 'Escolha o Destino',
			description: 'Selecione o local dos seus sonhos e defina as datas da viagem'
		},
		{
			number: '02',
			title: 'Convide o Grupo',
			description:
				'Adicione os emails dos participantes e deixe nossa plataforma cuidar dos convites'
		},
		{
			number: '03',
			title: 'Aproveite a Viagem',
			description: 'Tudo organizado! Agora é só aguardar a data e curtir cada momento'
		}
	];
</script>

<script lang="ts">
	import CarrouselParallax from '$lib/components/landing_page/carrousel-parallax.svelte';
	import FeatureCard from '$lib/components/landing_page/feature-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight, Heart, Star } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AOS from 'aos';

	let { handleStartNow, handleLearnMore } = $props();

	// Função para navegar para a página home
	function startNow() {
		if (handleStartNow) {
			handleStartNow();
		}
		goto('/home');
	}

	// Função para mostrar mais informações
	function learnMore() {
		if (handleLearnMore) {
			handleLearnMore();
		}
		// Scroll para a seção about
		const aboutSection = document.getElementById('about-section');
		if (aboutSection) {
			aboutSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		// Inicializar AOS
		AOS.init({
			duration: 800,
			easing: 'ease-out',
			once: true,
			offset: 100
		});
	});
</script>

<svelte:head></svelte:head>

<main class="overflow-hidden">
	<CarrouselParallax />

	<section id="about-section" class="relative bg-gradient-to-b from-gray-50 to-white py-20">
		<div class="container mx-auto px-4">
			<div data-aos="fade-up" data-aos-delay="100">
				<div class="mb-16 text-center">
					<h2 class="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
						Transforme Sonhos em Realidade
					</h2>
					<p class="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
						Sabe aquela viagem com os amigos, família ou até mesmo sozinho que você sempre sonhou e
						está prestes a realizar? Nós estamos aqui para fazer com que esse sonho não se torne um
						pesadelo!
					</p>
				</div>
			</div>

			<div data-aos="fade-up" data-aos-delay="200">
				<div class="mb-16 grid gap-8 md:grid-cols-3">
					{#each features as feature, index}
						<div data-aos="zoom-in" data-aos-delay={300 + index * 100}>
							<FeatureCard
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
							/>
						</div>
					{/each}
				</div>
			</div>

			<div data-aos="fade-up" data-aos-delay="400">
				<div class="text-center">
					<h3 class="mb-8 text-3xl font-bold text-gray-800">
						Facilite a gestão da sua viagem utilizando o que há de mais moderno no mercado
					</h3>
					<p class="mx-auto max-w-4xl text-lg leading-relaxed text-gray-600">
						Nossa ferramenta de planejamento de viagens é a solução perfeita para você que deseja
						ter uma melhor organização, desde quem irá compartilhar esse momento com você, as
						atividades que serão realizadas e a melhor parte: o compartilhamento de gastos de forma
						justa.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="bg-gradient-to-b from-emerald-50 to-emerald-100 py-20">
		<div class="container mx-auto px-4">
			<div data-aos="fade-up" data-aos-delay="100">
				<div class="mb-16 text-center">
					<h2 class="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">Como Funciona</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-600">
						Crie sua viagem de forma simples seguindo apenas 3 passos
					</p>
				</div>
			</div>

			<div class="grid gap-12 md:grid-cols-3">
				{#each steps as step, index}
					<div data-aos="fade-up" data-aos-delay={200 + index * 150}>
						<div class="group text-center">
							<div
								class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
							>
								{step.number}
							</div>
							<h3 class="mb-4 text-2xl font-bold text-gray-800">{step.title}</h3>
							<p class="leading-relaxed text-gray-600">{step.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-white py-20">
		<div class="container mx-auto px-4">
			<div data-aos="fade-up" data-aos-delay="100">
				<div class="mb-16 text-center">
					<h2 class="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
						O Que Nossos Viajantes Dizem
					</h2>
				</div>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each [{ name: 'Maria Silva', text: 'Organizei uma viagem incrível para 8 pessoas. A divisão de gastos foi super transparente!', rating: 5 }, { name: 'João Santos', text: 'Finalmente uma plataforma que facilita o planejamento em grupo. Recomendo!', rating: 5 }, { name: 'Ana Costa', text: 'Nossa lua de mel ficou perfeita graças ao planejamento detalhado da plataforma.', rating: 5 }] as testimonial, index}
					<div data-aos="flip-up" data-aos-delay={200 + index * 100}>
						<div
							class="rounded-2xl bg-gray-50 p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
						>
							<div class="mb-4 flex">
								{#each Array(testimonial.rating) as _}
									<Star class="h-5 w-5 fill-current text-yellow-400" />
								{/each}
							</div>
							<p class="mb-4 text-gray-600 italic">"{testimonial.text}"</p>
							<p class="font-semibold text-gray-800">- {testimonial.name}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="bg-gradient-to-r from-emerald-500 to-teal-600 py-20">
		<div class="container mx-auto px-4 text-center">
			<div data-aos="zoom-in" data-aos-delay="100">
				<div class="mx-auto max-w-4xl">
					<h2 class="mb-6 text-4xl font-bold text-white md:text-5xl">
						Pronto para Começar sua Aventura?
					</h2>
					<p class="mb-8 text-xl leading-relaxed text-emerald-100">
						Após essa apresentação, por que não dar uma chance? Clique abaixo e comece a planejar
						sua viagem dos sonhos conosco!
					</p>
					<div
						class="flex flex-col justify-center gap-4 sm:flex-row"
						data-aos="fade-up"
						data-aos-delay="300"
					>
						<Button
							size="lg"
							class="bg-white px-8 py-4 text-lg font-semibold text-emerald-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl"
							onclick={() => goto('/home')}
						>
							Começar Agora
							<ArrowRight class="ml-2 h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<footer class="bg-gray-800 py-12 text-white">
		<div class="container mx-auto px-4 text-center">
			<div data-aos="fade-up" data-aos-delay="100">
				<div class="mb-6 flex items-center justify-center">
					<Heart class="mr-2 h-6 w-6 text-red-400" />
					<p class="text-lg">Feito com amor para viajantes apaixonados</p>
				</div>
				<p class="text-gray-400">© 2024 Planeje sua Viagem. Todos os direitos reservados.</p>
			</div>
		</div>
	</footer>
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
