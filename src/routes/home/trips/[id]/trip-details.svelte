<script lang="ts">
	import { tripStore } from '$lib/store/tripsStore.js';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import {
		Calendar,
		MapPin,
		Users,
		Link,
		Plus,
		Edit,
		Share,
		Clock,
		CheckCircle,
		ExternalLink,
		UserPlus
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/components/schemas/users';

	let { id, user }: { id: string; user: User } = $props();

	let trip = $tripStore.find((trip) => trip.id === id);
	if (!trip) {
		throw new Error(`Trip with ID ${id} not found`);
	}

	let heroImageUrl = $state('');
	let isImageLoading = $state(true);
	let activeTab = $state('overview');

	let activities = $state([
		{
			id: 1,
			title: 'Visitar Torre Eiffel',
			description: 'Subir até o topo e apreciar a vista',
			date: '2024-07-15',
			time: '14:00',
			completed: false,
			assignedTo: ['user1', 'user2']
		},
		{
			id: 2,
			title: 'Jantar no Le Jules Verne',
			description: 'Restaurante no segundo andar da Torre Eiffel',
			date: '2024-07-15',
			time: '19:30',
			completed: false,
			assignedTo: ['user1']
		},
		{
			id: 3,
			title: 'Passeio pelo Louvre',
			description: 'Visitar as principais obras de arte',
			date: '2024-07-16',
			time: '10:00',
			completed: true,
			assignedTo: ['user2']
		}
	]);

	let usefulLinks = $state([
		{
			id: 1,
			title: 'Guia de Paris - Lonely Planet',
			url: 'https://www.lonelyplanet.com/france/paris',
			description: 'Guia completo da cidade'
		},
		{
			id: 2,
			title: 'Mapa do Metrô de Paris',
			url: 'https://www.ratp.fr/plan-metro',
			description: 'Sistema de transporte público'
		},
		{
			id: 3,
			title: 'Reservas de Restaurantes',
			url: 'https://www.opentable.com',
			description: 'Fazer reservas em restaurantes'
		}
	]);

	let members = $state([
		{
			id: 'user1',
			name: 'João Silva',
			email: 'joao@email.com',
			avatar: '/avatars/joao.jpg',
			role: 'Organizador',
			status: 'confirmed'
		},
		{
			id: 'user2',
			name: 'Maria Santos',
			email: 'maria@email.com',
			avatar: '/avatars/maria.jpg',
			role: 'Participante',
			status: 'confirmed'
		},
		{
			id: 'user3',
			name: 'Pedro Costa',
			email: 'pedro@email.com',
			avatar: '/avatars/pedro.jpg',
			role: 'Participante',
			status: 'pending'
		}
	]);

	// Gerar imagem usando API (exemplo com Unsplash)
	async function generateHeroImage() {
		try {
			isImageLoading = true;
			// Usando Unsplash API para gerar imagem baseada no destino
			if (!trip) {
				heroImageUrl = '/images/default-trip.jpg';
				return;
			}
			const query = encodeURIComponent(trip.destination);
			const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=nONF-WxVf6Ch5arOyEpnpbDz5x3kLLy68VxT0RzJpug`;
			const response = await fetch(unsplashUrl);
			const data = await response.json();
			heroImageUrl = data?.results[0]?.urls?.regular || '/images/default-trip.jpg';
		} catch (error) {
			console.error('Erro ao carregar imagem:', error);
			heroImageUrl = '/images/default-trip.jpg';
		} finally {
			isImageLoading = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	}

	function getDaysDifference(startDate: string, endDate: string) {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	function toggleActivity(activityId: number) {
		const activity = activities.find((a) => a.id === activityId);
		if (activity) {
			activity.completed = !activity.completed;
			activities = [...activities];
		}
	}

	function addActivity() {
		console.log('Adicionar nova atividade');
	}

	function addLink() {
		console.log('Adicionar novo link');
	}

	function inviteMember() {
		console.log('Convidar novo membro');
	}

	onMount(() => {
		generateHeroImage();
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="relative h-80 overflow-hidden">
		{#if isImageLoading}
			<div
				class="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400 to-purple-500"
			></div>
		{:else}
			<img
				src={heroImageUrl || '/placeholder.svg'}
				alt={trip.destination}
				class="h-full w-full object-cover"
				onerror={() => (heroImageUrl = '/images/default-trip.jpg')}
			/>
		{/if}
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

		<div class="absolute right-0 bottom-0 left-0 p-8">
			<div class="container mx-auto max-w-6xl">
				<div class="flex items-end justify-between">
					<div class="text-white">
						<h1 class="mb-2 text-4xl font-bold">{trip.title}</h1>
						<div class="flex items-center gap-4 text-lg opacity-90">
							<div class="flex items-center gap-2">
								<MapPin class="h-5 w-5" />
								{trip.destination}
							</div>
							<div class="flex items-center gap-2">
								<Calendar class="h-5 w-5" />
								{getDaysDifference(trip.startDate, trip.endDate)} dias
							</div>
							<div class="flex items-center gap-2">
								<Users class="h-5 w-5" />
								{members.length} pessoas
							</div>
						</div>
					</div>

					<div class="flex gap-2">
						<Button variant="secondary" size="sm" onclick={() => console.log('Editar')}>
							<Edit class="mr-2 h-4 w-4" />
							Editar
						</Button>
						<Button variant="secondary" size="sm" onclick={() => console.log('Compartilhar')}>
							<Share class="mr-2 h-4 w-4" />
							Compartilhar
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="container mx-auto max-w-6xl p-8">
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-blue-100 p-2">
							<Calendar class="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<p class="text-sm text-gray-600">Data de Início</p>
							<p class="font-semibold">{formatDate(trip.startDate)}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="p-6">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-green-100 p-2">
							<Calendar class="h-5 w-5 text-green-600" />
						</div>
						<div>
							<p class="text-sm text-gray-600">Data de Término</p>
							<p class="font-semibold">{formatDate(trip.endDate)}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="p-6">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-purple-100 p-2">
							<Users class="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<p class="text-sm text-gray-600">Participantes</p>
							<p class="font-semibold">
								{members.filter((m) => m.status === 'confirmed').length} confirmados
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<Tabs bind:value={activeTab} class="w-full">
			<TabsList class="mb-8 grid w-full grid-cols-4">
				<TabsTrigger value="overview">Visão Geral</TabsTrigger>
				<TabsTrigger value="activities">Atividades</TabsTrigger>
				<TabsTrigger value="links">Links Úteis</TabsTrigger>
				<TabsTrigger value="members">Membros</TabsTrigger>
			</TabsList>

			<TabsContent value="overview" class="space-y-6">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Card>
						<CardHeader class="flex flex-row items-center justify-between">
							<CardTitle class="text-lg">Atividades Recentes</CardTitle>
							<Button variant="ghost" size="sm" onclick={() => (activeTab = 'activities')}>
								Ver todas
							</Button>
						</CardHeader>
						<CardContent class="space-y-3">
							{#each activities.slice(0, 3) as activity}
								<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
									<button
										class={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
											activity.completed
												? 'border-green-500 bg-green-500'
												: 'border-gray-300 hover:border-green-400'
										}`}
										onclick={() => toggleActivity(activity.id)}
									>
										{#if activity.completed}
											<CheckCircle class="h-3 w-3 text-white" />
										{/if}
									</button>
									<div class="flex-1">
										<p
											class={`font-medium ${activity.completed ? 'text-gray-500 line-through' : ''}`}
										>
											{activity.title}
										</p>
										<p class="text-sm text-gray-600">{activity.date} às {activity.time}</p>
									</div>
								</div>
							{/each}
						</CardContent>
					</Card>

					<Card>
						<CardHeader class="flex flex-row items-center justify-between">
							<CardTitle class="text-lg">Membros da Equipe</CardTitle>
							<Button variant="ghost" size="sm" onclick={() => (activeTab = 'members')}>
								Ver todos
							</Button>
						</CardHeader>
						<CardContent>
							<div class="space-y-3">
								{#each members.slice(0, 3) as member}
									<div class="flex items-center gap-3">
										<Avatar>
											<AvatarImage src={member.avatar || '/placeholder.svg'} alt={member.name} />
											<AvatarFallback
												>{member.name
													.split(' ')
													.map((n) => n[0])
													.join('')}</AvatarFallback
											>
										</Avatar>
										<div class="flex-1">
											<p class="font-medium">{member.name}</p>
											<p class="text-sm text-gray-600">{member.role}</p>
										</div>
										<Badge variant={member.status === 'confirmed' ? 'default' : 'secondary'}>
											{member.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
										</Badge>
									</div>
								{/each}
							</div>
						</CardContent>
					</Card>
				</div>
			</TabsContent>

			<TabsContent value="activities" class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">Atividades da Viagem</h2>
					<Button onclick={addActivity}>
						<Plus class="mr-2 h-4 w-4" />
						Nova Atividade
					</Button>
				</div>

				<div class="space-y-4">
					{#each activities as activity}
						<Card class="transition-all hover:shadow-md">
							<CardContent class="p-6">
								<div class="flex items-start gap-4">
									<button
										class={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
											activity.completed
												? 'border-green-500 bg-green-500'
												: 'border-gray-300 hover:border-green-400'
										}`}
										onclick={() => toggleActivity(activity.id)}
									>
										{#if activity.completed}
											<CheckCircle class="h-4 w-4 text-white" />
										{/if}
									</button>

									<div class="flex-1">
										<h3
											class={`mb-2 text-lg font-semibold ${activity.completed ? 'text-gray-500 line-through' : ''}`}
										>
											{activity.title}
										</h3>
										<p class="mb-3 text-gray-600">{activity.description}</p>

										<div class="flex items-center gap-4 text-sm text-gray-500">
											<div class="flex items-center gap-1">
												<Calendar class="h-4 w-4" />
												{formatDate(activity.date)}
											</div>
											<div class="flex items-center gap-1">
												<Clock class="h-4 w-4" />
												{activity.time}
											</div>
											<div class="flex items-center gap-1">
												<Users class="h-4 w-4" />
												{activity.assignedTo.length} pessoa(s)
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</TabsContent>

			<TabsContent value="links" class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">Links Úteis</h2>
					<Button onclick={addLink}>
						<Plus class="mr-2 h-4 w-4" />
						Novo Link
					</Button>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each usefulLinks as link}
						<Card class="transition-all hover:shadow-md">
							<CardContent class="p-6">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h3 class="mb-2 text-lg font-semibold">{link.title}</h3>
										<p class="mb-3 text-gray-600">{link.description}</p>
										<a
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-800"
										>
											Visitar link
											<ExternalLink class="h-4 w-4" />
										</a>
									</div>
									<div class="rounded-lg bg-blue-100 p-2">
										<Link class="h-5 w-5 text-blue-600" />
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</TabsContent>

			<TabsContent value="members" class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">Membros da Viagem</h2>
					<Button onclick={inviteMember}>
						<UserPlus class="mr-2 h-4 w-4" />
						Convidar Membro
					</Button>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each members as member}
						<Card class="transition-all hover:shadow-md">
							<CardContent class="p-6 text-center">
								<Avatar class="mx-auto mb-4 h-16 w-16">
									<AvatarImage src={member.avatar || '/placeholder.svg'} alt={member.name} />
									<AvatarFallback class="text-lg">
										{member.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>

								<h3 class="mb-1 text-lg font-semibold">{member.name}</h3>
								<p class="mb-2 text-gray-600">{member.email}</p>
								<p class="mb-3 text-sm text-gray-500">{member.role}</p>

								<Badge
									variant={member.status === 'confirmed' ? 'default' : 'secondary'}
									class="mb-3"
								>
									{member.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
								</Badge>

								<div class="flex justify-center gap-2">
									<Button variant="outline" size="sm">Mensagem</Button>
									{#if member.role !== 'Organizador'}
										<Button variant="ghost" size="sm" class="text-red-600 hover:text-red-800">
											Remover
										</Button>
									{/if}
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</TabsContent>
		</Tabs>
	</div>
</div>
