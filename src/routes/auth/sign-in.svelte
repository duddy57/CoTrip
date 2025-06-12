<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { sigInRequestSchema, type SignInTypeSchema } from '$lib/components/schemas/users';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { fly, fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { Mail, Lock, LogIn, AlertCircle, CheckCircle } from '@lucide/svelte';

	let { data }: { data: { signInForm: SuperValidated<Infer<SignInTypeSchema>> } } = $props();

	let isSuccess = $state(false);
	let isLoading = $state(false);
	let hasError = $state(false);
	let mounted = $state(false);

	const form = superForm(data.signInForm, {
		validators: zodClient(sigInRequestSchema),
		scrollToError: 'smooth',
		legacy: true,
		onSubmit() {
			isLoading = true;
		},
		onResult(result) {
			isLoading = false;
			if (result.result.type === 'success') {
				hasError = false;
				isSuccess = true;
				setTimeout(() => {
					isSuccess = false;
				}, 3000);
			} else {
				hasError = true;
				isSuccess = false;
			}
		}
	});

	const { form: formData, enhance, message, errors } = form;

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
				<p class="text-sm font-medium text-emerald-800">Olá novamente!</p>
			</div>
		</div>
	{/if}

	{#if $message}
		<div
			class="rounded-lg border border-blue-200 bg-blue-50 p-4"
			in:scale={{ duration: 400, start: 0.8, easing: backOut }}
		>
			<div class="flex items-center gap-2">
				<AlertCircle class="h-5 w-5 text-blue-600" />
				<p class="text-sm font-medium text-blue-800">{$message}</p>
			</div>
		</div>
	{/if}

	<form method="POST" use:enhance action="?/signIn" class="space-y-4">
		{#if mounted}
			<div>
				<Form.Field {form} name="email">
					<Form.Control>
						<Form.Label class="text-sm font-medium text-gray-700">Email</Form.Label>
						<div class="relative mt-1">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Mail class="h-4 w-4 text-gray-400" />
							</div>
							<Input
								type="email"
								bind:value={$formData.email}
								class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
								placeholder="Digite seu email"
							/>
						</div>
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-500" />
				</Form.Field>
			</div>

			<div>
				<Form.Field {form} name="password">
					<Form.Control>
						<Form.Label class="text-sm font-medium text-gray-700">Senha</Form.Label>
						<div class="relative mt-1">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<Lock class="h-4 w-4 text-gray-400" />
							</div>
							<Input
								type="password"
								bind:value={$formData.password}
								class="block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
								placeholder="Digite sua senha"
							/>
						</div>
					</Form.Control>
					<Form.FieldErrors class="mt-1 text-sm text-red-500" />
				</Form.Field>
			</div>

			<div class="flex justify-end">
				<a
					href="/auth/reset-password"
					class="text-sm text-emerald-600 transition-colors hover:text-emerald-700"
				>
					Esqueceu sua senha?
				</a>
			</div>

			<div>
				<Button
					type="submit"
					disabled={isLoading}
					class="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 font-bold tracking-tighter text-white transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isLoading}
						<div class="flex items-center justify-center">
							<div class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
							Entrando...
						</div>
					{:else}
						<div class="flex items-center justify-center gap-2">
							<LogIn class="h-4 w-4" />
							Entrar
						</div>
					{/if}
				</Button>
			</div>
		{/if}
	</form>
</div>
