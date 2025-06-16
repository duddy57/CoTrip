<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	import { Input } from '$lib/components/ui/input';
	import {
		acceptTripInviteRequestSchema,
		type AcceptTripInviteRequestTypeSchema
	} from '$lib/schemas/trips';
	import type { User } from '$lib/schemas/users';
	import { onMount } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		MapPin,
		Calendar,
		Users,
		Check,
		X,
		Loader2,
		CheckCircle,
		AlertCircle,
		Mail,
		Plane
	} from '@lucide/svelte';
	import { tripStore } from '$lib/store/tripsStore';
	import { memberStore } from '$lib/store/memberStore';
	import { goto } from '$app/navigation';

	let {
		data,
		tripName = 'Viagem Incrível',
		organizerName = 'Organizador',
		startDate,
		endDate,
		destination = 'Destino não informado',
		memberCount = 0
	}: {
		data: {
			acceptTrip: SuperValidated<Infer<AcceptTripInviteRequestTypeSchema>>;
			memberId: string;
			tripId: string;
		};
		tripName?: string;
		organizerName?: string;
		startDate?: string;
		endDate?: string;
		destination?: string;
		memberCount?: number;
	} = $props();

	let isLoading = $state(false);
	let isSuccess = $state(false);
	let hasError = $state(false);
	let isDeclined = $state(false);

	const form = superForm(data.acceptTrip, {
		validators: zodClient(acceptTripInviteRequestSchema),
		scrollToError: 'smooth',
		dataType: 'json',
		onSubmit() {
			isLoading = true;
			isSuccess = false;
			hasError = false;
		},
		onResult(result) {
			console.log('Form submission result:', result);
			isLoading = false;

			if (result.result.type === 'success') {
				isSuccess = true;
				setTimeout(() => {
					goto(`/home`, {
						replaceState: true
					});
				}, 2000);
			} else if (result.result.type === 'error') {
				hasError = true;
			}
		}
	});

	const { form: formData, enhance } = form;

	onMount(() => {
		if (data.memberId) {
			$formData.memberId = data.memberId;
			$formData.tripId = data.tripId;
		}
	});

	function formatDate(dateString?: string) {
		if (!dateString) return 'Data não informada';
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-2xl">
	<Card.Root class="overflow-hidden border-0 shadow-lg">
		<div class="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
			<div class="mb-4 flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
				>
					<Mail class="h-6 w-6" />
				</div>
				<div>
					<h2 class="text-xl font-semibold">Convite de Viagem</h2>
					<p class="text-blue-100">Você foi convidado para uma aventura!</p>
				</div>
			</div>
		</div>

		<Card.Content class="space-y-6 p-6">
			{#if isSuccess}
				<Alert.Root class="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
					<CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
					<Alert.Title class="text-green-800 dark:text-green-200">Convite aceito!</Alert.Title>
					<Alert.Description class="text-green-700 dark:text-green-300">
						Parabéns! Você agora faz parte desta viagem. Prepare-se para uma experiência incrível!
						<br />Redirecionando para a página da viagem...
					</Alert.Description>
				</Alert.Root>
			{/if}

			{#if hasError}
				<Alert.Root class="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
					<AlertCircle class="h-4 w-4 text-red-600 dark:text-red-400" />
					<Alert.Title class="text-red-800 dark:text-red-200">Erro</Alert.Title>
					<Alert.Description class="text-red-700 dark:text-red-300">
						Ocorreu um erro ao processar seu convite. Tente novamente.
					</Alert.Description>
				</Alert.Root>
			{/if}

			{#if !isSuccess}
				<div class="border-t pt-6">
					<p class="mb-6 text-center font-medium tracking-tighter text-gray-700 dark:text-gray-300">
						Deseja aceitar este convite e fazer parte desta viagem?
					</p>

					<form method="POST" use:enhance>
						<Form.Field {form} name="memberId">
							<Form.Control>
								{#snippet children({ props })}
									<Input {...props} bind:value={$formData.memberId} type="hidden" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="tripId">
							<Form.Control>
								{#snippet children({ props })}
									<Input {...props} bind:value={$formData.tripId} type="hidden" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Button
							type="submit"
							disabled={isLoading}
							class="w-full min-w-[120px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
						>
							{#if isLoading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Aceitando...
							{:else}
								<Check class="mr-2 h-4 w-4" />
								Aceitar convite
							{/if}
						</Form.Button>
					</form>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
