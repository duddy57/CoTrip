<script>
	let { steps, currentStep } = $props();
</script>

<div class="flex items-center justify-between">
	{#each steps as step, index}
		<div class="flex flex-1 flex-col items-center">
			<!-- Step circle -->
			<div class="flex w-full items-center">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-300
          {index === currentStep
						? 'scale-110 bg-blue-600 text-white shadow-lg'
						: index < currentStep
							? 'bg-green-600 text-white'
							: 'bg-gray-200 text-gray-600'}"
				>
					{#if index < currentStep}
						✓
					{:else}
						<span class="text-lg">{step.icon}</span>
					{/if}
				</div>

				{#if index < steps.length - 1}
					<div
						class="mx-4 h-1 flex-1 rounded transition-all duration-300
            {index < currentStep ? 'bg-green-600' : 'bg-gray-200'}"
					></div>
				{/if}
			</div>

			<!-- Step info -->
			<div class="mt-3 text-center">
				<h4 class="text-sm font-medium {index === currentStep ? 'text-blue-600' : 'text-gray-600'}">
					{step.title}
				</h4>
				<p class="mt-1 text-xs text-gray-400">
					{step.description}
				</p>
			</div>
		</div>
	{/each}
</div>
