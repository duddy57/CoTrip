<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';

	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import {
		createTripActivitySchema,
		type CreateTripActivityTypeSchema
	} from '$lib/schemas/activities';
	import { Lamp, Plus, Loader2, CheckCircle, AlertCircle, Users, MapPin } from '@lucide/svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Textarea } from '$lib/components/ui/textarea';
	import { onMount } from 'svelte';

	let {
		data
	}: { data: { addActivity: SuperValidated<Infer<CreateTripActivityTypeSchema>>; id: string } } =
		$props();

	let isLoading = $state(false);
	let isSuccess = $state(false);
	let hasError = $state(false);
	let dialogOpen = $state(false);

	const form = superForm(data.addActivity, {
		validators: zodClient(createTripActivitySchema),
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
					dialogOpen = false;
					isSuccess = false;
				}, 2000);
			} else if (result.result.type === 'error') {
				hasError = true;
			}
		}
	});

	const { form: formData, enhance } = form;

	function handleDialogChange(open: boolean) {
		dialogOpen = open;
		if (!open) {
			isLoading = false;
			isSuccess = false;
			hasError = false;
		}
	}

	onMount(() => {
		$formData.tripId = data.id;
	});
</script>

<Dialog.Root bind:open={dialogOpen} onOpenChange={handleDialogChange}>
	<Dialog.Trigger
		class={buttonVariants({
			variant: 'default',
			size: 'default'
		})}
	>
		<Plus class="mr-2 h-4 w-4" />
		Adicionar Atividade
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header class="space-y-3">
			<div class="flex items-center gap-2">
				<div class="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
					<MapPin class="text-primary h-5 w-5" />
				</div>
				<div>
					<Dialog.Title class="text-xl font-semibold">Adicionar Atividade</Dialog.Title>
					<Dialog.Description class="text-muted-foreground text-sm">
						Adicione uma nova atividade à sua viagem
					</Dialog.Description>
				</div>
			</div>

			<Alert.Root class="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
				<Lamp class="h-4 w-4 text-amber-600 dark:text-amber-400" />
				<Alert.Title class="text-amber-800 dark:text-amber-200">Dica importante</Alert.Title>
				<Alert.Description class="text-amber-700 dark:text-amber-300">
					Adicione atividades com antecedência para garantir que todos possam participar.
				</Alert.Description>
			</Alert.Root>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			{#if isSuccess}
				<Alert.Root class="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
					<CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
					<Alert.Title class="text-green-800 dark:text-green-200">Sucesso!</Alert.Title>
					<Alert.Description class="text-green-700 dark:text-green-300">
						Atividade adicionada com sucesso.
					</Alert.Description>
				</Alert.Root>
			{/if}

			{#if hasError}
				<Alert.Root class="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
					<AlertCircle class="h-4 w-4 text-red-600 dark:text-red-400" />
					<Alert.Title class="text-red-800 dark:text-red-200">Erro</Alert.Title>
					<Alert.Description class="text-red-700 dark:text-red-300">
						Ocorreu um erro ao adicionar a atividade. Tente novamente.
					</Alert.Description>
				</Alert.Root>
			{/if}

			<form method="POST" action="?/addActivity" use:enhance class="space-y-4">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium">Nome da Atividade</Form.Label>
							<Input
								{...props}
								bind:value={$formData.name}
								placeholder="Digite o nome da atividade"
								disabled={isLoading}
								class="mt-1"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="cost">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium">Custo</Form.Label>
							<Input
								{...props}
								bind:value={$formData.cost}
								type="number"
								placeholder="Digite o custo da atividade"
								disabled={isLoading}
								class="mt-1"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="text-sm font-medium">Descrição</Form.Label>
							<Textarea
								{...props}
								placeholder="Conte-nos um pouco sobre a atividade"
								class="resize-none"
								bind:value={$formData.description}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="tripId">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} bind:value={$formData.tripId} type="hidden" class="mt-1" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="flex justify-end gap-3 pt-4">
					<Button
						type="button"
						variant="outline"
						onclick={() => (dialogOpen = false)}
						disabled={isLoading}
					>
						Cancelar
					</Button>
					<Form.Button type="submit" disabled={isLoading || isSuccess} class="min-w-[100px]">
						{#if isLoading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Adicionando...
						{:else if isSuccess}
							<CheckCircle class="mr-2 h-4 w-4" />
							Adicionado!
						{:else}
							<Plus class="mr-2 h-4 w-4" />
							Adicionar
						{/if}
					</Form.Button>
				</div>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>
