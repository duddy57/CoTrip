<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, X, Mail, Check } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	// Estado para armazenar os emails confirmados
	let { emails = $bindable([]) } = $props();

	// Estado para o campo de input atual
	let currentEmail = $state('');

	// Função para validar email
	function isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Função para adicionar email à lista
	function addEmail() {
		if (currentEmail.trim() !== '' && isValidEmail(currentEmail.trim())) {
			// Verifica se o email já existe na lista
			if (!emails.includes(currentEmail.trim())) {
				emails = [...emails, currentEmail.trim()];
				currentEmail = ''; // Limpa o campo após adicionar
			}
		}
	}

	// Função para remover email da lista
	function removeEmail(emailToRemove: string) {
		emails = emails.filter((email) => email !== emailToRemove);
	}

	// Função para adicionar email ao pressionar Enter
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addEmail();
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="outline" class="flex w-full items-center justify-center gap-2">
			<Mail class="h-4 w-4" />
			{#if emails.length === 0}
				<span>Adicione amigos que irão viajar com você</span>
			{:else}
				<span
					>{emails.length} {emails.length === 1 ? 'pessoa convidada' : 'pessoas convidadas'}</span
				>
			{/if}
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-xl font-semibold">
				<Mail class="h-5 w-5" />
				Convidar Participantes
			</Dialog.Title>
			<Dialog.Description class="text-sm text-gray-500">
				Adicione os emails das pessoas que você deseja convidar para esta viagem.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			{#if emails.length > 0}
				<div class="space-y-2 rounded-md bg-blue-50 p-3">
					<Label class="text-sm font-medium text-blue-800">Emails adicionados</Label>
					<div class="flex flex-wrap gap-2">
						{#each emails as email}
							<div
								class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
							>
								<span>{email}</span>
								<button
									class="text-blue-600 hover:text-blue-800 focus:outline-none"
									onclick={() => removeEmail(email)}
								>
									<X class="h-3 w-3" />
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<div class="space-y-2">
				<Label for="email-input" class="text-sm font-medium">Adicionar novo email</Label>
				<div class="flex gap-2">
					<div class="relative flex-1">
						<Mail class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
						<Input
							id="email-input"
							type="email"
							placeholder="email@exemplo.com"
							bind:value={currentEmail}
							class={cn(
								'pl-10',
								isValidEmail(currentEmail.trim()) ? ' border-green-300' : ' border-red-300'
							)}
							onkeydown={handleKeydown}
						/>
					</div>
					<Button
						type="button"
						variant="secondary"
						onclick={addEmail}
						disabled={!currentEmail.trim() || !isValidEmail(currentEmail.trim())}
					>
						<Plus class="mr-1 h-4 w-4" />
						Adicionar
					</Button>
				</div>
				{#if currentEmail.trim() !== '' && !isValidEmail(currentEmail.trim())}
					<p class="text-xs text-red-500">Email inválido</p>
				{/if}
			</div>

			<div class="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
				<p class="flex items-center gap-2">
					<Check class="h-4 w-4 text-green-500" />
					Pressione Enter para adicionar rapidamente
				</p>
			</div>
		</div>

		<Dialog.Footer class="flex justify-end gap-2">
			<Dialog.Close>
				<Button variant="outline">Cancelar</Button>
			</Dialog.Close>
			<Dialog.Close>
				<Button>Confirmar</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
