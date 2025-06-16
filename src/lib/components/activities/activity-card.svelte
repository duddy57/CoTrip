<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { activityStore } from '$lib/store/activityStore';
</script>

<div class="space-y-4">
	{#if $activityStore.length === 0}
		<Card class="p-6 text-center">
			<CardContent>
				<p class="text-gray-500">Nenhuma atividade planejada ainda.</p>
			</CardContent>
		</Card>
	{:else}
		{#each $activityStore as activity (activity.id)}
			<Card class="transition-all hover:shadow-md">
				<CardContent class="p-6">
					<div class="flex-1">
						<h3 class="mb-2 text-lg font-semibold">
							{activity.name}
						</h3>
						<p class="mb-3 text-gray-600">{activity.description}</p>
					</div>
				</CardContent>
			</Card>
		{/each}
	{/if}
</div>
