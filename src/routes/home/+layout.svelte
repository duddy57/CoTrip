<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Navbar from '$lib/components/navbar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ArrowLeft } from '@lucide/svelte';

	let isMainRoute = $derived(page.url.pathname === '/home');

	let scrollY = $state(0);
	let innerHeight = $state(0);

	function goBack() {
		if (browser) {
			if (window.history.length > 1) {
				history.back();
			} else {
				window.location.href = '/';
			}
		}
	}

	let { children } = $props();
</script>

<svelte:head>
	<title>Home - CoTrip</title>
	<meta name="description" content="Página inicial do aplicativo" />
</svelte:head>

<svelte:window bind:scrollY />

<main>
	<div
		class={cn(
			'flex items-center justify-between px-4 text-white',
			scrollY > 50 ? 'h-auto' : 'h-16'
		)}
	>
		<Navbar />
		{#if !isMainRoute}
			<header class="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
				<div class="flex h-16 max-w-4xl items-center justify-between px-4">
					<Button
						variant="ghost"
						size="sm"
						onclick={goBack}
						class="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
					>
						<ArrowLeft class="h-4 w-4" />
						<span class="hidden sm:inline">Voltar</span>
					</Button>
				</div>
			</header>
		{/if}
	</div>
	{@render children()}
</main>
