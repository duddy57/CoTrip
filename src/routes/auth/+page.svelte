<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import SignIn from './sign-in.svelte';
	import SignUp from './sign-up.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { data }: { data: PageData } = $props();
	let authMethod = $state('sign-in');
	let mounted = $state(false);

	$effect(() => {
		authMethod = page.url.searchParams.get('method') === 'sign-up' ? 'sign-up' : 'sign-in';
	});

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>{authMethod === 'sign-in' ? 'Entrar' : 'Registre-se'} - CoTrip</title>
	<meta name="description" content="Autentique-se para acessar sua conta" />
</svelte:head>

<main
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4"
>
	<div class="mx-auto w-full max-w-6xl">
		{#if mounted}
			<div
				class="relative mx-auto w-full max-w-md"
				in:fly={{ y: 20, duration: 800, delay: 200, easing: quintOut }}
			>
				<div
					class="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl"
				></div>
				<div
					class="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl"
				></div>
				<div
					class="relative rounded-2xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-sm"
					in:scale={{ duration: 600, delay: 400, start: 0.95, easing: quintOut }}
				>
					<div class="mb-8 text-center">
						<h1
							class="mb-2 text-3xl font-bold text-gray-900"
							in:fade={{ duration: 400, delay: 600 }}
						>
							{authMethod === 'sign-in' ? 'Bem vindo de volta' : 'Criar uma conta'}
						</h1>
						<p class="text-gray-600" in:fade={{ duration: 400, delay: 700 }}>
							{authMethod === 'sign-in'
								? 'Entre na sua conta para continuar'
								: 'Registre-se para começar a usar nossos serviços'}
						</p>
					</div>

					<Separator class="mb-6" />

					<div class="mb-6">
						{#key authMethod}
							<div in:fade={{ duration: 300 }}>
								{#if authMethod === 'sign-in'}
									<SignIn {data} />
								{:else}
									<SignUp {data} />
								{/if}
							</div>
						{/key}
					</div>

					<div class="text-center" in:fade={{ duration: 400, delay: 800 }}>
						<p class="mb-4 text-gray-600">
							{authMethod === 'sign-in' ? 'Não tem uma conta?' : 'Já possui uma conta?'}
						</p>
						<a
							href={`?method=${authMethod === 'sign-in' ? 'sign-up' : 'sign-in'}`}
							class="inline-flex items-center justify-center rounded-lg bg-emerald-50 px-6 py-3 text-sm font-medium text-emerald-600 transition-all duration-200 hover:bg-emerald-100 hover:shadow-md focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
							aria-label={authMethod === 'sign-in' ? 'Switch to Sign Up' : 'Switch to Sign In'}
						>
							{authMethod === 'sign-in' ? 'Crie uma!' : 'Entrar'}
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}
</style>
