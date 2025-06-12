<script lang="ts">
	import { userStore } from '$lib/store/userStore';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import TripForm from './trip-form.svelte';
	import DataTable from '$lib/components/table-trips/data-table.svelte';
	import { tripStore } from '$lib/store/tripsStore';
	import { columns } from '$lib/components/table-trips/columns';
	import { createTripResponseSchema } from '$lib/schemas/trips';
	import type { z } from 'zod';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import {
		MapPin,
		Calendar,
		Users,
		TrendingUp,
		Sun,
		Cloud,
		CloudRain,
		Plane,
		Clock,
		Star
	} from '@lucide/svelte';

	let position = $state(0);
	let tripsArray = $state<z.infer<typeof createTripResponseSchema>[]>([]);
	let currentTime = $state('');
	let greeting = $state('');
	let weather = $state({ temp: 0, condition: 'sunny', city: 'São Paulo' });
	let stats = $state({
		totalTrips: 0,
		upcomingTrips: 0,
		completedTrips: 0,
		totalDestinations: 0
	});

	let { data }: { data: PageData } = $props();

	function updateTime() {
		const now = new Date();
		const hours = now.getHours();

		currentTime = now.toLocaleTimeString('pt-BR', {
			hour: '2-digit',
			minute: '2-digit'
		});

		if (hours < 12) {
			greeting = 'Bom dia';
		} else if (hours < 18) {
			greeting = 'Boa tarde';
		} else {
			greeting = 'Boa noite';
		}
	}

	function getWeatherIcon(condition: string) {
		switch (condition) {
			case 'sunny':
				return Sun;
			case 'cloudy':
				return Cloud;
			case 'rainy':
				return CloudRain;
			default:
				return Sun;
		}
	}

	onMount(() => {
		tripStore.set([
			{
				id: '1',
				title: 'Viagem para Paris',
				destination: 'Paris, França',
				startDate: '2024-06-15',
				endDate: '2024-06-22'
			},
			{
				id: '2',
				title: 'Aventura no Rio',
				destination: 'Rio de Janeiro, Brasil',
				startDate: '2024-05-10',
				endDate: '2024-05-17'
			},
			{
				id: '3',
				title: 'Exploração de Tóquio',
				destination: 'Tóquio, Japão',
				startDate: '2024-08-01',
				endDate: '2024-08-10'
			}
		]);

		weather = {
			temp: Math.floor(Math.random() * 15) + 20,
			condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
			city: 'São Paulo'
		};

		updateTime();
		const timeInterval = setInterval(updateTime, 60000);

		userStore.set(data.user);

		return () => clearInterval(timeInterval);
	});
</script>

<svelte:window bind:scrollY={position} />

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
	<div class="container mx-auto px-4 py-8">
		<div
			class="mb-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-lg"
		>
			<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<div class="flex-1">
					<div class="mb-2 flex items-center gap-2">
						<Clock class="h-5 w-5" />
						<span class="text-emerald-100">{currentTime}</span>
					</div>
					<h1 class="text-3xl font-bold md:text-4xl">
						{greeting}, {data.user?.name || 'Viajante'}! ✈️
					</h1>
					<p class="mt-2 text-emerald-100">Pronto para planejar sua próxima aventura?</p>
				</div>
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
						<svelte:component this={getWeatherIcon(weather.condition)} class="h-5 w-5" />
						<span class="font-semibold">{weather.temp}°C</span>
						<span class="text-emerald-100">{weather.city}</span>
					</div>
				</div>
			</div>
		</div>

		{#if tripsArray.length > 0}
			<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card class="border-0 shadow-md transition-all duration-300 hover:shadow-lg">
					<CardContent class="p-6">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Total de Viagens</p>
								<p class="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
							</div>
							<div class="rounded-full bg-blue-100 p-3">
								<Plane class="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card class="border-0 shadow-md transition-all duration-300 hover:shadow-lg">
					<CardContent class="p-6">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Próximas Viagens</p>
								<p class="text-2xl font-bold text-emerald-600">{stats.upcomingTrips}</p>
							</div>
							<div class="rounded-full bg-emerald-100 p-3">
								<Calendar class="h-6 w-6 text-emerald-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card class="border-0 shadow-md transition-all duration-300 hover:shadow-lg">
					<CardContent class="p-6">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Viagens Concluídas</p>
								<p class="text-2xl font-bold text-purple-600">{stats.completedTrips}</p>
							</div>
							<div class="rounded-full bg-purple-100 p-3">
								<Star class="h-6 w-6 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card class="border-0 shadow-md transition-all duration-300 hover:shadow-lg">
					<CardContent class="p-6">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-600">Destinos Únicos</p>
								<p class="text-2xl font-bold text-orange-600">{stats.totalDestinations}</p>
							</div>
							<div class="rounded-full bg-orange-100 p-3">
								<MapPin class="h-6 w-6 text-orange-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		{/if}

		<div class="mb-8 flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold text-gray-900">Suas Viagens</h2>
				<p class="text-gray-600">Gerencie e acompanhe todas as suas aventuras</p>
			</div>
			<TripForm {data} />
		</div>

		{#if tripsArray.length > 0}
			<div class="mb-8">
				<h3 class="mb-4 text-lg font-semibold text-gray-900">🚀 Próximas Aventuras</h3>
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each tripsArray.filter((trip) => new Date(trip.startDate) > new Date()) as trip}
						<Card
							class="border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
						>
							<CardContent class="p-6">
								<div class="mb-3 flex items-start justify-between">
									<h4 class="font-semibold text-gray-900">{trip.title}</h4>
									<Badge variant="secondary" class="bg-emerald-100 text-emerald-700">Próxima</Badge>
								</div>
								<div class="space-y-2 text-sm text-gray-600">
									<div class="flex items-center gap-2">
										<MapPin class="h-4 w-4" />
										<span>{trip.destination}</span>
									</div>
									<div class="flex items-center gap-2">
										<Calendar class="h-4 w-4" />
										<span>{new Date(trip.startDate).toLocaleDateString('pt-BR')}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</div>

			<Card class="border-0 shadow-lg">
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<TrendingUp class="h-5 w-5" />
						Todas as Viagens
					</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable {columns} />
				</CardContent>
			</Card>
		{:else}
			<Card class="border-0 shadow-lg">
				<CardContent class="py-16">
					<div class="text-center">
						<div
							class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100"
						>
							<Plane class="h-12 w-12 text-emerald-600" />
						</div>
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Sua primeira aventura te espera!</h2>
						<p class="mx-auto mb-8 max-w-md text-gray-600">
							Parece que você ainda não tem viagens planejadas. Que tal começar a planejar sua
							próxima aventura?
						</p>
						<div class="flex flex-col items-center space-y-6">
							<TripForm {data} />
							<div class="flex items-center justify-center gap-8 text-sm text-gray-500">
								<div class="flex items-center gap-2">
									<Users class="h-4 w-4" />
									<span>Convide amigos</span>
								</div>
								<div class="flex items-center gap-2">
									<MapPin class="h-4 w-4" />
									<span>Escolha destinos</span>
								</div>
								<div class="flex items-center gap-2">
									<Calendar class="h-4 w-4" />
									<span>Defina datas</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		{/if}

		<div class="mt-12 grid gap-6 md:grid-cols-2">
			<Card class="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
				<CardContent class="p-6">
					<h3 class="mb-3 font-semibold text-blue-900">💡 Dica do Dia</h3>
					<p class="text-blue-800">
						Planeje suas viagens com antecedência para conseguir melhores preços em passagens e
						hospedagem!
					</p>
				</CardContent>
			</Card>

			<Card class="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
				<CardContent class="p-6">
					<h3 class="mb-3 font-semibold text-purple-900">🌟 Inspiração</h3>
					<p class="text-purple-800">
						"A vida é uma aventura ousada ou não é nada." - Helen Keller
					</p>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
