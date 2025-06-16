<script lang="ts">
	import * as AlertDialog from '../ui/alert-dialog';
	import * as Form from '../ui/form';
	import { Button, buttonVariants } from '../ui/button';
	import { Input } from '../ui/input';
	import * as Alert from '../ui/alert';

	import { deleteTripRequestSchema, type DeleteTripRequestTypeSchema } from '$lib/schemas/trips';
	import { onMount } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Trash2, AlertTriangle, Loader2 } from '@lucide/svelte';
	import { Label } from '../ui/label';
	import {
		removeMemberForTripRequestSchema,
		type RemoveMemberForTripRequestTypeSchema
	} from '$lib/schemas/members';

	const validatePhrase = 'Quero deletar';
	let phrase = $state('');
	let isLoading = $state(false);
	let dialogOpen = $state(false);

	let isDisabled = $derived.by(() => {
		return phrase !== validatePhrase || isLoading;
	});

	let {
		data,
		id
	}: {
		data: { removeMember: SuperValidated<Infer<RemoveMemberForTripRequestTypeSchema>> };
		id: string;
	} = $props();

	const form = superForm(data.removeMember, {
		validators: zodClient(removeMemberForTripRequestSchema),
		onSubmit() {
			isLoading = true;
		},
		onResult(result) {
			isLoading = false;
			if (result.result.type === 'success') {
				dialogOpen = false;
			}
		}
	});

	const { form: formData, enhance } = form;

	onMount(() => {
		$formData.memberId = id;
	});

	function handleDialogChange(open: boolean) {
		dialogOpen = open;
		if (!open) {
			phrase = '';
			isLoading = false;
		}
	}
</script>

<AlertDialog.Root bind:open={dialogOpen} onOpenChange={handleDialogChange}>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive', size: 'sm' })}>
		<Trash2 class=" h-4 w-4" />
	</AlertDialog.Trigger>
	<AlertDialog.Content class="sm:max-w-lg">
		<AlertDialog.Header class="space-y-4">
			<div class="flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
				>
					<AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-400" />
				</div>
				<div>
					<AlertDialog.Title class="text-xl font-semibold text-red-900 dark:text-red-100">
						Remover membro
					</AlertDialog.Title>
					<AlertDialog.Description class="text-red-700 dark:text-red-300">
						Você tem certeza que deseja remover este membro?
					</AlertDialog.Description>
				</div>
			</div>

			<Alert.Root class="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
				<AlertTriangle class="h-4 w-4 text-red-600 dark:text-red-400" />
				<Alert.Title class="text-red-800 dark:text-red-200">Atenção!</Alert.Title>
				<Alert.Description class="text-red-700 dark:text-red-300">
					Esta ação não pode ser desfeita.
				</Alert.Description>
			</Alert.Root>
		</AlertDialog.Header>

		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label
					for="confirmation-phrase"
					class="text-sm font-medium text-gray-900 dark:text-gray-100"
				>
					Para confirmar, digite: <span class="font-mono text-red-600 dark:text-red-400"
						>"{validatePhrase}"</span
					>
				</Label>
				<Input
					id="confirmation-phrase"
					bind:value={phrase}
					placeholder="Digite a frase de confirmação"
					disabled={isLoading}
					class="border-red-200 focus:border-red-500 focus:ring-red-500"
				/>
				{#if phrase && phrase !== validatePhrase}
					<p class="text-sm text-red-600 dark:text-red-400">
						A frase não confere. Digite exatamente: "{validatePhrase}"
					</p>
				{/if}
			</div>

			<form id="delete-member-form" method="POST" action="?/removeMember" use:enhance>
				<Form.Field {form} name="memberId">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} type="hidden" bind:value={$formData.memberId} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</form>
		</div>

		<AlertDialog.Footer class="gap-3">
			<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
			<Button
				type="submit"
				form="delete-member-form"
				variant="destructive"
				disabled={isDisabled}
				class="min-w-[120px]"
			>
				{#if isLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Removendo...
				{:else}
					<Trash2 class="mr-2 h-4 w-4" />
					Remover membro
				{/if}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
