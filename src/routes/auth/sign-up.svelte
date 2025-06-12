<script lang="ts">
	import { onMount } from 'svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signUpRequestSchema, type SignUpTypeSchema } from '$lib/components/schemas/users';
	import { goto } from '$app/navigation';
	import { fly, fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { Mail, Lock, User, CheckCircle, UserPlus } from '@lucide/svelte';

	let { data }: { data: { signUpForm: SuperValidated<Infer<SignUpTypeSchema>> } } = $props();

	let isLoading = $state(false);
	let isSuccess = $state(false);
	let mounted = $state(false);

	const form = superForm(data.signUpForm, {
		validators: zodClient(signUpRequestSchema),
		scrollToError: 'smooth',
		legacy: true,
		onSubmit() {
			isLoading = true;
		},
		onResult(result) {
			isLoading = false;
			if (result.result.type === 'success') {
				isSuccess = true;
				setTimeout(() => {
					isSuccess = false;
				}, 3000);

				goto('/auth?method=sign-in', {
					replaceState: true,
					state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
				});
			}
		}
	});

	const { form: formData, enhance, errors, message } = form;

	onMount(() => {
		mounted = true;
	});
</script>

<div class="space-y-6">
	{#if isSuccess}
		<div
			class="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
			in:scale={{ duration: 400, start: 0.8, easing: backOut }}
		>
			<div class="flex items-center gap-2">
				<CheckCircle class="h-5 w-5 text-emerald-600" />
				<p class="text-sm font-medium text-emerald-800">Seja bem vindo!</p>
			</div>
		</div>
	{/if}

	<form method="POST" use:enhance action="?/signUp" class="space-y-4">
		{#if mounted}
			<div in:fly={{ y: 20, duration: 400, delay: 100 }}>
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium text-gray-700">Nome completo</Form.Label>
							<div class="relative mt-1">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<User class="h-4 w-4 text-gray-400" />
								</div>
								<Input
									{...props}
									type="text"
									bind:value={$formData.name}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
									placeholder="Seu nome completo"
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-500" />
				</Form.Field>
			</div>

			<div in:fly={{ y: 20, duration: 400, delay: 200 }}>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium text-gray-700">Email</Form.Label>
							<div class="relative mt-1">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail class="h-4 w-4 text-gray-400" />
								</div>
								<Input
									{...props}
									type="email"
									bind:value={$formData.email}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
									placeholder="Seu email"
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-500" />
				</Form.Field>
			</div>

			<div in:fly={{ y: 20, duration: 400, delay: 300 }}>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium text-gray-700">Senha</Form.Label>
							<div class="relative mt-1">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock class="h-4 w-4 text-gray-400" />
								</div>
								<Input
									{...props}
									type="password"
									bind:value={$formData.password}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
									placeholder="Crie uma senha segura"
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-500" />
				</Form.Field>
			</div>

			<div in:fly={{ y: 20, duration: 400, delay: 400 }}>
				<Form.Field {form} name="confirmPassword">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium text-gray-700">Confirme sua senha</Form.Label>
							<div class="relative mt-1">
								<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Lock class="h-4 w-4 text-gray-400" />
								</div>
								<Input
									{...props}
									type="password"
									bind:value={$formData.confirmPassword}
									class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
									placeholder="Confirme sua senha"
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-500" />
				</Form.Field>
			</div>

			<div in:fly={{ y: 20, duration: 400, delay: 500 }}>
				<Button
					type="submit"
					disabled={isLoading}
					class="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 font-bold tracking-tight text-white transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
						<div class="flex items-center justify-center gap-2">
							<UserPlus class="h-4 w-4" />
							Criar conta
						</div>
					{/if}
				</Button>
			</div>
		{/if}
	</form>

	<div in:fade={{ duration: 400, delay: 600 }} class="text-center text-xs text-gray-500">
		Ao criar uma conta, você concorda com nossos
		<a href="/terms" class="text-emerald-600 transition-colors duration-200 hover:text-emerald-700"
			>Termos de Serviço</a
		>
		e
		<a
			href="/privacy"
			class="text-emerald-600 transition-colors duration-200 hover:text-emerald-700"
			>Política de Privacidade</a
		>
	</div>
</div>
