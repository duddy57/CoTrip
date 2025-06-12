<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { sigInRequestSchema } from '$lib/schemas/users';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { signInForm } = $props();

	let isSuccess = $state(false);
	let isLoading = $state(false);
	let formContainer = $state<HTMLElement>();
	let emailField = $state<HTMLElement>();
	let passwordField = $state<HTMLElement>();
	let submitButton = $state<HTMLElement>();
	let successMessage = $state<HTMLElement>();

	const form = superForm(signInForm, {
		validators: zodClient(sigInRequestSchema),
		scrollToError: 'smooth',
		legacy: true,
		onSubmit() {
			isLoading = true;
			animateSubmit();
		},
		onResult(result) {
			isLoading = false;
			if (result.result.type === 'success') {
				isSuccess = true;
				animateSuccess();
				setTimeout(() => {
					isSuccess = false;
				}, 3000);
			} else {
				animateError();
			}
		}
	});

	const { form: formData, enhance, message, errors } = form;

	const animateFormEntrance = () => {
		if (!formContainer) return;

		const fields = [emailField, passwordField, submitButton].filter(Boolean);

		gsap.set(fields, { opacity: 0, y: 20 });

		gsap.to(fields, {
			opacity: 1,
			y: 0,
			duration: 0.6,
			stagger: 0.1,
			ease: 'power3.out'
		});
	};

	const animateSubmit = () => {
		if (!submitButton) return;

		gsap.to(submitButton, {
			scale: 0.98,
			duration: 0.1,
			yoyo: true,
			repeat: 1
		});
	};

	const animateSuccess = () => {
		if (!successMessage) return;

		gsap.fromTo(
			successMessage,
			{ opacity: 0, scale: 0.8, y: -10 },
			{ opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
		);
	};

	const animateError = () => {
		const errorFields = [];
		if ($errors.email) errorFields.push(emailField);
		if ($errors.password) errorFields.push(passwordField);

		if (errorFields.length > 0) {
			gsap.to(errorFields, {
				keyframes: [{ x: -5 }, { x: 5 }, { x: -5 }, { x: 5 }, { x: 0 }],
				duration: 0.4,
				ease: 'power2.inOut'
			});
		}
	};

	const handleInputFocus = (element: HTMLElement) => {
		gsap.to(element, {
			scale: 1.02,
			duration: 0.2,
			ease: 'power2.out'
		});
	};

	const handleInputBlur = (element: HTMLElement) => {
		gsap.to(element, {
			scale: 1,
			duration: 0.2,
			ease: 'power2.out'
		});
	};

	onMount(() => {
		animateFormEntrance();
	});
</script>

<div bind:this={formContainer} class="space-y-6">
	{#if isSuccess}
		<div bind:this={successMessage} class="rounded-lg border border-green-200 bg-green-50 p-4">
			<p class="text-sm font-medium text-green-800">Olá novamente!</p>
		</div>
	{/if}

	{#if $message}
		<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
			<p class="text-sm font-medium text-blue-800">{$message}</p>
		</div>
	{/if}

	<form method="POST" use:enhance action="?/signIn" class="space-y-4">
		<div bind:this={emailField}>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="text-sm font-medium text-gray-700">Email</Form.Label>
						<Input
							{...props}
							type="email"
							bind:value={$formData.email}
							class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
							placeholder="Digite seu email"
							onfocus={(e) => handleInputFocus(e.currentTarget)}
							onblur={(e) => handleInputBlur(e.currentTarget)}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-sm text-red-500" />
			</Form.Field>
		</div>

		<div bind:this={passwordField}>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="text-sm font-medium text-gray-700">Senha</Form.Label>
						<Input
							{...props}
							type="password"
							bind:value={$formData.password}
							class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
							placeholder="Digite sua senha"
							onfocus={(e) => handleInputFocus(e.currentTarget)}
							onblur={(e) => handleInputBlur(e.currentTarget)}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-sm text-red-500" />
			</Form.Field>
		</div>

		<div bind:this={submitButton} class="pt-2">
			<Button
				type="submit"
				disabled={isLoading}
				class="w-full rounded-lg bg-sky-600 px-4 py-2.5 font-bold tracking-tighter text-white transition-all duration-200 hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				onclick={(e) => {
					e.preventDefault();
					form.submit();
				}}
			>
				{#if isLoading}
					<div class="flex items-center justify-center">
						<div class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
						Entrando...
					</div>
				{:else}
					Entrar
				{/if}
			</Button>
		</div>
	</form>
</div>
