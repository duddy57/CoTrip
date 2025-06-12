<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { userStore } from '$lib/store/userStore';

	import logo_png from '$lib/assets/logo-att.png';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';

	let position = $state(0);

	function generateRandomColorGradient() {
		const colors = ['#FF5733', '#33FF57', '#3357FF', '#F0F', '#0FF'];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		return `linear-gradient(45deg, ${randomColor}, #fff)`;
	}

	function getTwoLetter(name: string): string {
		return name
			.split(' ')
			.map((part) => part.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('');
	}
</script>

<svelte:window bind:scrollY={position} />

<div
	class={cn(
		'fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between border-b bg-white/90 p-2 px-8 backdrop-blur-sm transition-all duration-300',
		position > 100 ? 'hidden' : 'bg-opacity-100 shadow-none'
	)}
>
	<div>
		<img src={logo_png} alt="Logo cotrip" class="w-16s h-10" />
	</div>
	<div>
		<!-- {#if userStore != null} -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="relative h-10 w-10 rounded-full transition-colors hover:bg-white/20"
			>
				<Avatar.Root class="h-10 w-10">
					<Avatar.Image style="background: {generateRandomColorGradient()}" alt={$userStore.name} />
					<Avatar.Fallback
						class="bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white"
					>
						{getTwoLetter($userStore.name)}
					</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56 border border-white/30 bg-white/90 backdrop-blur-md">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="font-normal">
						<div class="flex flex-col space-y-1">
							<p class="text-sm font-bold tracking-tight">{$userStore.name}</p>
							<p class="text-muted-foreground text-xs">@{$userStore.email}</p>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						class="hover:bg-white/20"
						onclick={() => {
							goto(`/home/${$userStore.name}/me`);
						}}>Perfil</DropdownMenu.Item
					>
					<DropdownMenu.Item class="hover:bg-white/20">Assinatura</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<!-- s -->
	</div>
</div>
