<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signUpRequestSchema } from '$lib/schemas/users';
	import { goto } from '$app/navigation';

	let { signUpForm } = $props();

	let isLoading = $state(false);
	let isSuccess = $state(false);
	let formContainer = $state<HTMLElement>();
	let nameField = $state<HTMLElement>();
	``;
	let emailField = $state<HTMLElement>();
	let passwordField = $state<HTMLElement>();
	let submitButton = $state<HTMLElement>();
	let successMessage = $state<HTMLElement>();

	const form = superForm(signUpForm, {
		validators: zodClient(signUpRequestSchema),
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

				goto('/auth?method=sign-in', {
					replaceState: true,
					state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
				});
			} else {
				animateError();
			}
		}
	});

	const { form: formData, enhance, errors, message } = form;

	const animateFormEntrance = () => {
		if (!formContainer) return;

		const fields = [nameField, emailField, passwordField, submitButton].filter(Boolean);

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
		if ($errors.name) errorFields.push(nameField);
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
			<p class="text-sm font-medium text-green-800">Seja bem vindo!</p>
		</div>
	{/if}

	<form method="POST" use:enhance action="?/signUp" class="space-y-4">
		<div bind:this={nameField}>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="text-sm font-medium text-gray-700">Nome completo</Form.Label>
						<Input
							{...props}
							type="text"
							bind:value={$formData.name}
							class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
							placeholder="Seu nome completo"
							onclick={(e) => handleInputFocus(e.currentTarget)}
							onblur={(e) => handleInputBlur(e.currentTarget)}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-sm text-red-500" />
			</Form.Field>
		</div>

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
							placeholder="Seu email"
							onclick={(e) => handleInputFocus(e.currentTarget)}
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
							class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
							placeholder="Crie uma senha segura"
							onclick={(e) => handleInputFocus(e.currentTarget)}
							onblur={(e) => handleInputBlur(e.currentTarget)}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-sm text-red-500" />
			</Form.Field>
		</div>

		<div bind:this={passwordField}>
			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="text-sm font-medium text-gray-700">Confirme sua senha</Form.Label>
						<Input
							{...props}
							type="password"
							bind:value={$formData.confirmPassword}
							class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
							placeholder="Confirme sua senha"
							onclick={(e) => handleInputFocus(e.currentTarget)}
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
				class="w-full rounded-lg bg-sky-600 px-4 py-2.5 font-bold tracking-tight text-white transition-all duration-200 hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				onclick={(e) => {
					e.preventDefault();
					form.submit();
				}}
			>
				{#if isLoading}
					<div class="flex items-center justify-center">
						<div class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
						Criando conta...
					</div>
				{:else}
					Criar conta
				{/if}
			</Button>
		</div>
	</form>

	<div class="text-center text-xs text-gray-500">
		Ao criar uma conta, você concorda com nossos
		<a
			href="https://example.com/terms"
			class="text-sky-600 transition-colors duration-200 hover:text-sky-700">Termos de Serviço</a
		>
		e
		<a
			href="https://example.com/privacy"
			class="text-sky-600 transition-colors duration-200 hover:text-sky-700"
			>Política de Privacidade</a
		>
	</div>
</div>
