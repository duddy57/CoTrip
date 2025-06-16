<script lang="ts">
	import type { PageData } from './$types';
	import AcceptForm from './accept-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<main>
	<AcceptForm {data} />
</main>
