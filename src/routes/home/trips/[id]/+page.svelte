<script lang="ts">
	import TripDetails from './trip-details.svelte';

	let { data } = $props();

	let { id, user } = data;
</script>

<main>
	<TripDetails {id} {user} />
</main>
