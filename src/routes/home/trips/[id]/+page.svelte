<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import TripDetails from './trip-details.svelte';
	import { memberStore } from '$lib/store/memberStore';
	import { activityStore } from '$lib/store/activityStore';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		memberStore.set(data.members || []);
		activityStore.set(data.activities || []);
	});
</script>

<main>
	<TripDetails {data} />
</main>
