<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { EllipsisIcon } from '@lucide/svelte';
	import RemoveButton from './removeButton.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { DeleteTripRequestTypeSchema } from '$lib/schemas/trips';

	let {
		id,
		data
	}: { id: string; data: { deleteTrip: SuperValidated<Infer<DeleteTripRequestTypeSchema>> } } =
		$props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Abrir menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Ações</DropdownMenu.Label>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
				Copiar ID da viagem
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => goto(`/home/trips/${id}`)}>Ver detalhes</DropdownMenu.Item>
		<DropdownMenu.Item>Editar</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
