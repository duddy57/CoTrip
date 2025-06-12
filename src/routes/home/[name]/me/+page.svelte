<script lang="ts">
	import type { PageData } from './$types';
	import UpdateProfile from './update-profile.svelte';
	import { onMount } from 'svelte';
	import AOS from 'aos';

	let { data }: { data: PageData } = $props();

	const { updateProfile } = data;

	onMount(() => {
		AOS.init({
			duration: 600,
			easing: 'ease-out-cubic',
			once: true
		});
	});
</script>

<svelte:head>
	<title>Meu Perfil - CoTrip</title>
	<meta name="description" content="Gerencie suas informações pessoais e configurações de conta" />
	<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
	<div class="container mx-auto px-4 py-8">
		<div class="mb-8 text-center" data-aos="fade-down">
			<h1 class="mb-2 text-4xl font-bold text-gray-900">Meu Perfil</h1>
			<p class="text-gray-600">Gerencie suas informações pessoais e configurações</p>
		</div>

		<div data-aos="fade-up" data-aos-delay="200">
			<UpdateProfile {updateProfile} />
		</div>
	</div>
</main>
