+page.svelte:

  <script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import SignIn from './sign-in.svelte';
	import SignUp from './sign-up.svelte';

	import bg_svg from '$lib/assets/bg.svg';

	let { data }: { data: PageData } = $props();
	let authMethod = $state<'sign-in' | 'sign-up'>('sign-in');

	$effect(() => {
		const methodParam = page.url.searchParams.get('method');
		authMethod = methodParam === 'sign-up' ? 'sign-up' : 'sign-in';
	});
</script>

<main>
	<div>
		<div>
			<img src={bg_svg} alt="" />
		</div>
		<div>
			{#if authMethod === 'sign-in'}
				<SignIn signInForm={data.loginForm} />
			{:else}
				<SignUp signUpForm={data.registerForm} />
			{/if}

    		{#if authMethod === 'sign-in'}
    			<a data-sveltekit-preload-data href="?method=sign-up" aria-label="Sign Up">Sign Up</a>
    		{:else}
    			<a data-sveltekit-preload-data href="?method=sign-in" aria-label="Sign In">Sign In</a>
    		{/if}
    	</div>
    </div>

</main>

sign-in.svelte:

<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	import { sigInRequestSchema } from './schemas';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { signInForm } = $props();

	let isSuccess = $state(false);

	const form = superForm(signInForm, {
		validators: zodClient(sigInRequestSchema),
		scrollToError: 'smooth',
		legacy: true,
		onResult(result) {
			if (result.result.type === 'success') {
				isSuccess = true;
				setTimeout(() => {
					isSuccess = false;
				}, 3000);
			}
		}
	});

	const { form: formData, enhance, message } = form;
</script>

<div>
	<form method="POST" use:enhance action="?/signIn">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} type="email" bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Senha</Form.Label>
					<Input {...props} bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button type="submit">Submit</Form.Button>
	</form>
</div>

sign-up.svelte:

<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signUpRequestSchema } from './schemas';

	let { signUpForm } = $props();

	const form = superForm(signUpForm, {
		validators: zodClient(signUpRequestSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div>
	<h1>Sign Up</h1>
	<form method="POST" use:enhance action="?/signUp">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Senha</Form.Label>
					<Input {...props} bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Nome</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
</div>

<div class={cn('h-32 w-full')}>
	<nav
		class="mx-auto max-w-7xl rounded-2xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-md"
	>
		<div class="flex items-center justify-between p-4">
			<!-- Logo -->
			<div class="flex items-center gap-4">
				<img src={logo_png} alt={$userStore.name} class="h-12 w-auto" />
			</div>

    		<div>
    			{#if $userStore}
    				<DropdownMenu.Root>
    					<DropdownMenu.Trigger
    						class="relative h-10 w-10 rounded-full transition-colors hover:bg-white/20"
    					>
    						<Avatar.Root class="h-10 w-10">
    							<Avatar.Image
    								style="background: {generateRandomColorGradient()}"
    								alt={$userStore.name}
    							/>
    							<Avatar.Fallback
    								class="bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white"
    							>
    								{getTwoLetter($userStore.name)}
    							</Avatar.Fallback>
    						</Avatar.Root>
    					</DropdownMenu.Trigger>
    					<DropdownMenu.Content class="w-56 border border-white/30 bg-white/90 backdrop-blur-md">
    						<DropdownMenu.Group>
    							<DropdownMenu.Label class="font-normal">
    								<div class="flex flex-col space-y-1">
    									<p class="text-sm font-bold tracking-tight">{$userStore.name}</p>
    									<p class="text-muted-foreground text-xs">@{$userStore.email}</p>
    								</div>
    							</DropdownMenu.Label>
    							<DropdownMenu.Separator />
    							<DropdownMenu.Item
    								class="hover:bg-white/20"
    								onclick={() => {
    									goto(`/home/${$userStore.name}`);
    								}}>Perfil</DropdownMenu.Item
    							>
    							<DropdownMenu.Item class="hover:bg-white/20">Assinatura</DropdownMenu.Item>
    						</DropdownMenu.Group>
    					</DropdownMenu.Content>
    				</DropdownMenu.Root>
    			{:else}
    				<div class="flex gap-2">
    					<Button
    						class="border border-white/20 bg-blue-600/80 text-white backdrop-blur-sm transition-all hover:bg-blue-700/80"
    						onclick={() => goto('/auth?method=sign-in')}
    					>
    						Entrar
    					</Button>
    					<Button
    						class="border-white/30 bg-white/20 text-gray-800 backdrop-blur-sm transition-all hover:bg-white/30"
    						onclick={() => goto('/auth?method=sign-up')}
    					>
    						Registrar
    					</Button>
    				</div>
    			{/if}
    		</div>
    	</div>
    </nav>

</div>
