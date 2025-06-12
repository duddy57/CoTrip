<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { userStore } from '$lib/store/userStore';
	import { Base64ToPng } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms';
	import { updateProfileRequestSchema } from '$lib/components/schemas/users';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { fade, scale, fly } from 'svelte/transition';
	import {
		Calendar,
		Mail,
		User,
		Camera,
		Edit3,
		Save,
		X,
		MapPin,
		Phone,
		Globe,
		Shield,
		Settings,
		Upload
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let { updateProfile } = $props();

	const form = superForm(updateProfile, {
		validators: zodClient(updateProfileRequestSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Perfil atualizado com sucesso!');
				isEditMode = false;
			} else if (result.type === 'error') {
				toast.error('Erro ao atualizar perfil. Tente novamente.');
			}
		}
	});

	const { form: formData, enhance, submitting } = $state(form);

	let isEditMode = $state(false);
	let fileInput = $state<HTMLInputElement>();
	let dragOver = $state(false);
	let imagePreview = $state('');

	// Dados adicionais do perfil (simulados)
	const profileStats = {
		tripsCompleted: 12,
		countriesVisited: 8,
		totalDistance: '45,230 km',
		memberLevel: 'Explorer'
	};

	function generateRandomColorGradient() {
		const gradients = [
			'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
			'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
			'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
			'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
		];
		return gradients[Math.floor(Math.random() * gradients.length)];
	}

	function getTwoLetter(name: string): string {
		return name
			.split(' ')
			.map((part) => part.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('');
	}

	function formatDate(dateString: string | Date): string {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleImageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error('Imagem muito grande. Máximo 5MB permitido.');
				return;
			}

			if (!file.type.startsWith('image/')) {
				toast.error('Por favor, selecione apenas arquivos de imagem.');
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const base64String = e.target?.result as string;
				const cleanBase64 = base64String.split(',')[1] || base64String;

				$formData.image = cleanBase64;
				imagePreview = base64String;

				userStore.update((user) => ({
					...user,
					image: cleanBase64
				}));

				toast.success('Imagem carregada com sucesso!');
			};
			reader.readAsDataURL(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			const fakeEvent = { target: { files: [file] } } as any;
			handleImageChange(fakeEvent);
		}
	}

	function toggleEditMode() {
		isEditMode = !isEditMode;
		if (!isEditMode) {
			imagePreview = '';
		}
	}

	function getMemberLevelColor(level: string) {
		switch (level) {
			case 'Explorer':
				return 'bg-emerald-100 text-emerald-700';
			case 'Adventurer':
				return 'bg-blue-100 text-blue-700';
			case 'Globetrotter':
				return 'bg-purple-100 text-purple-700';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	}
</script>

<div class="mx-auto max-w-6xl">
	<div class="grid gap-8 lg:grid-cols-3">
		<div class="lg:col-span-1">
			<Card class="border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
				<CardContent class="p-8 text-center">
					<div class="relative mb-6" in:scale={{ duration: 500, delay: 200 }}>
						<div
							class="group relative mx-auto transition-transform duration-300 hover:scale-105"
							onclick={() => fileInput?.click()}
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
							ondrop={handleDrop}
							class:ring-4={dragOver}
							class:ring-blue-400={dragOver}
							class:ring-opacity-50={dragOver}
							role="button"
							aria-label="Drag and drop image"
							tabindex="0"
							onkeydown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									fileInput?.click();
								}
							}}
						>
							<Avatar.Root class="h-32 w-32 border-4 border-white shadow-2xl">
								<Avatar.Image
									style="background: {generateRandomColorGradient()}"
									src={imagePreview || Base64ToPng($userStore.image || '')}
									alt={$userStore.name}
									class="object-cover"
								/>
								<Avatar.Fallback
									class="bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white"
								>
									{getTwoLetter($userStore.name)}
								</Avatar.Fallback>
							</Avatar.Root>

							{#if isEditMode}
								<div
									class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
									in:fade={{ duration: 300 }}
								>
									<button
										type="button"
										onclick={() => fileInput?.click()}
										class="rounded-full bg-white p-2 text-gray-700 shadow-lg transition-transform hover:scale-110"
										tabindex="0"
										onkeydown={(event) => {
											if (event.key === 'Enter' || event.key === ' ') {
												fileInput?.click();
											}
										}}
									>
										<Upload size={20} />
									</button>
								</div>

								<button
									type="button"
									onclick={() => fileInput?.click()}
									class="absolute -right-2 -bottom-2 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-blue-600"
									tabindex="0"
									onkeydown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											fileInput?.click();
										}
									}}
								>
									<Camera size={16} />
								</button>
							{/if}
						</div>

						{#if dragOver}
							<div
								class="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-blue-400 bg-blue-50/80"
								in:fade={{ duration: 200 }}
							>
								<p class="text-sm font-medium text-blue-600">Solte a imagem aqui</p>
							</div>
						{/if}
					</div>

					<div in:fade={{ duration: 500, delay: 400 }}>
						<h2 class="mb-1 text-2xl font-bold text-gray-900">{$userStore.name}</h2>
						<p class="mb-3 text-gray-600">{$userStore.email}</p>
						<Badge class={getMemberLevelColor(profileStats.memberLevel)}>
							{profileStats.memberLevel}
						</Badge>
					</div>

					<!-- Stats -->
					<div class="mt-6 grid grid-cols-2 gap-4" in:fly={{ y: 20, duration: 500, delay: 600 }}>
						<div class="text-center">
							<p class="text-2xl font-bold text-emerald-600">{profileStats.tripsCompleted}</p>
							<p class="text-xs text-gray-600">Viagens</p>
						</div>
						<div class="text-center">
							<p class="text-2xl font-bold text-blue-600">{profileStats.countriesVisited}</p>
							<p class="text-xs text-gray-600">Países</p>
						</div>
					</div>

					<div class="mt-6 border-t border-gray-200 pt-6" in:fade={{ duration: 500, delay: 800 }}>
						<div class="flex items-center justify-center gap-2 text-sm text-gray-600">
							<Calendar size={16} />
							<span>Membro desde {formatDate($userStore.createdAt)}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<div class="space-y-6 lg:col-span-2">
			<Card class="border-0 shadow-xl">
				<CardHeader class="pb-4">
					<div class="flex items-center justify-between">
						<CardTitle class="flex items-center gap-2">
							<User size={20} />
							Informações Pessoais
						</CardTitle>
						{#if !isEditMode}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onclick={toggleEditMode}
								class="flex items-center gap-2"
								tabindex={0}
								onkeydown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										toggleEditMode();
									}
								}}
							>
								<Edit3 size={16} />
								Editar
							</Button>
						{/if}
					</div>
				</CardHeader>

				<CardContent>
					<form method="POST" use:enhance class="space-y-6">
						<input
							bind:this={fileInput}
							type="file"
							accept="image/*"
							onchange={handleImageChange}
							class="hidden"
						/>

						<div class="grid gap-6 md:grid-cols-2">
							<div class="space-y-2">
								<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
									<User size={16} />
									Nome Completo
								</label>
								{#if isEditMode}
									<Form.Field {form} name="name">
										<Form.Control>
											{#snippet children({ props })}
												<Input
													{...props}
													bind:value={$formData.name}
													placeholder="Seu nome completo"
													class="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
												/>
											{/snippet}
										</Form.Control>
										<Form.FieldErrors />
									</Form.Field>
								{:else}
									<Input value={$userStore.name} disabled class="bg-gray-50 text-gray-700" />
								{/if}
							</div>
							<div class="space-y-2">
								<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
									<Mail size={16} />
									Email
								</label>
								<Input value={$userStore.email} disabled class="bg-gray-50 text-gray-700" />
								<p class="text-xs text-gray-500">O email não pode ser alterado</p>
							</div>
						</div>

						{#if isEditMode}
							<div class="grid gap-6 md:grid-cols-2" in:fly={{ y: 20, duration: 300 }}>
								<div class="space-y-2">
									<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
										<Phone size={16} />
										Telefone
									</label>
									<Input
										placeholder="(11) 99999-9999"
										class="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div class="space-y-2">
									<label class="flex items-center gap-2 text-sm font-medium text-gray-700">
										<MapPin size={16} />
										Localização
									</label>
									<Input
										placeholder="Cidade, Estado"
										class="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
						{/if}

						{#if isEditMode}
							<Form.Field {form} name="image">
								<Form.Control>
									{#snippet children({ props })}
										<input type="hidden" {...props} bind:value={$formData.image} />
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						{/if}

						{#if isEditMode}
							<div
								class="flex gap-3 border-t border-gray-200 pt-6"
								in:fly={{ y: 20, duration: 300 }}
							>
								<Form.Button
									disabled={$submitting}
									class="flex-1 bg-emerald-500 text-white transition-all duration-200 hover:bg-emerald-600 disabled:opacity-50"
									tabindex={0}
								>
									{#if submitting}
										<div class="flex items-center gap-2">
											<div
												class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
											></div>
											Salvando...
										</div>
									{:else}
										<div class="flex items-center gap-2">
											<Save size={16} />
											Salvar Alterações
										</div>
									{/if}
								</Form.Button>
								<Button
									type="button"
									variant="outline"
									onclick={toggleEditMode}
									disabled={$submitting}
									class="flex-1 transition-all duration-200"
									tabindex={0}
									onkeydown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											toggleEditMode();
										}
									}}
								>
									<X size={16} />
									Cancelar
								</Button>
							</div>
						{/if}
					</form>
				</CardContent>
			</Card>

			<Card class="border-0 shadow-xl">
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<Settings size={20} />
						Configurações da Conta
					</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div class="flex items-center gap-3">
							<Shield size={20} class="text-green-600" />
							<div>
								<p class="font-medium text-gray-900">Verificação de Email</p>
								<p class="text-sm text-gray-600">Sua conta está verificada</p>
							</div>
						</div>
						<Badge variant="secondary" class="bg-green-100 text-green-700">Verificado</Badge>
					</div>

					<div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div class="flex items-center gap-3">
							<Globe size={20} class="text-blue-600" />
							<div>
								<p class="font-medium text-gray-900">Idioma</p>
								<p class="text-sm text-gray-600">Português (Brasil)</p>
							</div>
						</div>
						<Button variant="outline" size="sm">Alterar</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
