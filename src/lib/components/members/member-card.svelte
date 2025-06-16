<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { memberStore } from '$lib/store/memberStore';
	import RemoveMembers from './remove-members.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { RemoveMemberForTripRequestTypeSchema } from '$lib/schemas/members';

	let {
		data,
		userOwnerId
	}: {
		data: { removeMember: SuperValidated<Infer<RemoveMemberForTripRequestTypeSchema>> };
		userOwnerId: string;
	} = $props();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#if $memberStore.length === 0}
		<Card class="p-6 text-center">
			<CardContent>
				<p class="text-gray-500">Nenhum membro adicionado ainda.</p>
			</CardContent>
		</Card>
	{:else}
		{#each $memberStore as member}
			<Card class="transition-all hover:shadow-md">
				<CardContent class="p-6 text-center">
					<h3 class="mb-1 text-lg font-semibold">{member.name}</h3>
					<p class="mb-2 text-gray-600">{member.email}</p>

					<Badge variant={member.inviteStatus === 0 ? 'default' : 'secondary'} class="mb-3">
						{member.inviteStatus === 0 ? 'Pendente' : 'Confirmado'}
					</Badge>

					<div class="flex justify-center gap-2">
						<Button variant="outline" size="sm">Mensagem</Button>
						{#if member.id !== userOwnerId}
							<RemoveMembers {data} id={member.id} />
						{/if}
					</div>
				</CardContent>
			</Card>
		{/each}
	{/if}
</div>
