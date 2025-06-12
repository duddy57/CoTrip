<script>
	let { progress } = $props();
</script>

<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
	<div
		class="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
		style="width: {progress}%"
	></div>
</div>
