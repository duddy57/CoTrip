<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
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
		Stars,
		Settings,
		DollarSign
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/schemas/users';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { CreateTripActivityTypeSchema } from '$lib/schemas/activities';
	import type {
		AddMemberToTripRequestTypeSchema,
		RemoveMemberForTripRequestTypeSchema
	} from '$lib/schemas/members';
	import { getTripsResponseSchema } from '$lib/schemas/trips';
	import { memberStore } from '$lib/store/memberStore';
	import { z } from 'zod';
	import AddMember from '$lib/components/members/add-member.svelte';
	import MemberCard from '$lib/components/members/member-card.svelte';
	import AddActivity from '$lib/components/activities/add-activity.svelte';
	import ActivityCard from '$lib/components/activities/activity-card.svelte';
	import { activityStore } from '$lib/store/activityStore';

	let {
		data
	}: {
		data: {
			id: string;
			user: User;
			trip: z.infer<typeof getTripsResponseSchema>;
			addActivity: SuperValidated<Infer<CreateTripActivityTypeSchema>>;
			addMember: SuperValidated<Infer<AddMemberToTripRequestTypeSchema>>;
			removeMember: SuperValidated<Infer<RemoveMemberForTripRequestTypeSchema>>;
		};
	} = $props();

	let trip = data.trip;

	let heroImageUrl = $state('');
	let isImageLoading = $state(true);
	let activeTab = $state('overview');

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

	async function generateHeroImage() {
		try {
			isImageLoading = true;
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

	function addLink() {
		console.log('Adicionar novo link');
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
								{$memberStore.length} pessoas
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
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
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
								{$memberStore.filter((m) => m.inviteStatus === 1).length} confirmados
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent class="p-6">
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-green-100 p-2">
							<DollarSign class="h-5 w-5 text-green-600" />
						</div>
						<div>
							<p class="text-sm text-gray-600">Media de valor</p>
							<p class="font-semibold">
								{trip.budget ? `R$ ${trip.budget.toFixed(2)}` : 'Não definido'}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		<Tabs bind:value={activeTab} class="w-full">
			<TabsList class="mb-8 grid w-full grid-cols-6">
				<TabsTrigger value="overview">Visão Geral</TabsTrigger>
				<TabsTrigger value="activities">Atividades</TabsTrigger>
				<TabsTrigger value="links">Links Úteis</TabsTrigger>
				<TabsTrigger value="members">Membros</TabsTrigger>
				<TabsTrigger value="ia">
					<Stars class="h-5 w-5" />
				</TabsTrigger>
				<TabsTrigger value="settings">
					<Settings class="h-5 w-5" />
				</TabsTrigger>
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
							{#if $activityStore.length === 0}
								<p class="text-gray-500">Nenhuma atividade registrada ainda.</p>
							{:else}
								{#each $activityStore.slice(0, 3) as activity}
									<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
										<div class="flex-1">
											<p class="font-medium text-gray-500">
												{activity.name}
											</p>
											<p class="truncate overflow-hidden text-sm text-gray-600">
												{activity.description}
											</p>
										</div>
									</div>
								{/each}
							{/if}
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
								{#if $memberStore.length > 0}
									{#each $memberStore.slice(0, 3) as member}
										<div class="flex items-center gap-3">
											<div class="flex-1">
												<p class="font-medium">{member.name}</p>
											</div>
											<Badge variant={member.inviteStatus === 0 ? 'default' : 'secondary'}>
												{member.inviteStatus === 1 ? 'Confirmado' : 'Pendente'}
											</Badge>
										</div>
									{/each}
								{:else}
									<p class="text-gray-500">Nenhum membro adicionado ainda.</p>
								{/if}
							</div>
						</CardContent>
					</Card>
				</div>
			</TabsContent>

			<TabsContent value="activities" class="space-y-6">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl font-bold">Atividades da Viagem</h2>
					<AddActivity data={{ addActivity: data.addActivity }} />
				</div>
				<ActivityCard />
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
					<AddMember data={{ addMember: data.addMember }} />
				</div>

				<MemberCard data={{ removeMember: data.removeMember }} userOwnerId={trip.userOwnerId} />
			</TabsContent>

			<TabsContent value="ia" class="space-y-6">
				<Card>
					<CardContent class="items-center p-6 text-center">
						<p>Em breve</p>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="settings" class="space-y-6">
				<Card>
					<CardContent class="items-center p-6 text-center">
						<p>Em breve</p>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	</div>
</div>
