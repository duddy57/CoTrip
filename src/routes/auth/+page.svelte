<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import SignIn from './sign-in.svelte';
	import SignUp from './sign-up.svelte';

	import bg_svg from '$lib/assets/auth-bg.svg';

	import { Separator } from '$lib/components/ui/separator';

	let { data }: { data: PageData } = $props();
	let previousMethod = 'sign-in';

	let mainContainer: HTMLElement;
	let bgImage: HTMLElement;
	let formContainer: HTMLElement;
	let switchButton: HTMLElement;

	let authMethod = $state<'sign-in' | 'sign-up'>('sign-in');

	$effect(() => {
		const methodParam = page.url.searchParams.get('method');
		authMethod = methodParam === 'sign-up' ? 'sign-up' : 'sign-in';
	});

	const animateFormTransition = () => {
		if (!formContainer) return;

		const tl = gsap.timeline();

		tl.to(formContainer, {
			x: previousMethod === 'sign-in' ? -50 : 50,
			opacity: 0,
			duration: 0.3,
			ease: 'power2.inOut'
		})
			.set(formContainer, {
				x: authMethod === 'sign-in' ? 50 : -50
			})
			.to(formContainer, {
				x: 0,
				opacity: 1,
				duration: 0.4,
				ease: 'power2.out'
			});
	};

	const animateInitialLoad = () => {
		if (!mainContainer || !bgImage || !formContainer) return;

		const tl = gsap.timeline();

		gsap.set([bgImage, formContainer], { opacity: 0 });
		gsap.set(bgImage, { scale: 1.1, rotation: -2 });
		gsap.set(formContainer, { y: 30 });

		tl.to(bgImage, {
			opacity: 1,
			scale: 1,
			rotation: 0,
			duration: 1.2,
			ease: 'power3.out'
		}).to(
			formContainer,
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power3.out'
			},
			'-=0.6'
		);
	};

	onMount(() => {
		animateInitialLoad();
	});
</script>

<svelte:head>
	<title>{authMethod === 'sign-in' ? 'Entrar' : 'Registre-se'} - CoTrip</title>
	<meta name="description" content="Authenticate to access your account" />
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<main
	bind:this={mainContainer}
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4"
>
	<div class="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
		<div bind:this={bgImage} class="hidden items-center justify-center md:flex">
			<img
				src={bg_svg}
				alt="Authentication illustration"
				class="h-auto w-full max-w-lg drop-shadow-2xl"
			/>
		</div>

		<div bind:this={formContainer} class="mx-auto w-full max-w-md">
			<div class="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
				<div class="mb-8 text-center">
					<h1 class="mb-2 text-3xl font-bold text-gray-900">
						{authMethod === 'sign-in' ? 'Bem vindo de volta' : 'Criar uma conta'}
					</h1>
					<p class="text-gray-600">
						{authMethod === 'sign-in'
							? 'Entre na sua conta para continuar'
							: 'Registre-se para começar a usar nossos serviços'}
					</p>
				</div>

				<Separator class="mb-6" />

				<div class="mb-6">
					{#if authMethod === 'sign-in'}
						<SignIn signInForm={data.loginForm} />
					{:else}
						<SignUp signUpForm={data.registerForm} />
					{/if}
				</div>
				<div class="text-center">
					<p class="mb-4 text-gray-600">
						{authMethod === 'sign-in' ? 'Não tem uma conta?' : 'Já possui uma conta?'}
					</p>
					<a
						bind:this={switchButton}
						href={`?method=${authMethod === 'sign-in' ? 'sign-up' : 'sign-in'}`}
						class="inline-flex items-center justify-center rounded-lg bg-sky-50 px-6 py-3 text-sm font-medium text-sky-600 transition-all duration-200 hover:bg-sky-100 hover:shadow-md focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
						aria-label={authMethod === 'sign-in' ? 'Switch to Sign Up' : 'Switch to Sign In'}
					>
						{authMethod === 'sign-in' ? 'Crie uma!' : 'Entrar'}
					</a>
				</div>
			</div>
		</div>
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
