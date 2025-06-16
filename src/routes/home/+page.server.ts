import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	createTripRequestSchema,
	deleteTripRequestSchema,
	getTripsResponseSchema
} from '$lib/schemas/trips';
import { redirect } from '@sveltejs/kit';
import { API_URL } from '$lib';

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
	if (!locals.user) {
		return redirect(302, '/auth?method=sign-in');
	}

	async function getTrips() {
		try {
			const url = new URL('/app/Trips/listTrips', API_URL);

			const requestOptions: RequestInit = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				}
			};

			const response = await fetch(url.toString(), requestOptions);

			console.log('Response status:', response.status, response.statusText);

			if (!response.ok) {
				console.error('API request failed:', response.status, response.statusText);
				return [];
			}

			const data = await response.json();

			if (!data || !Array.isArray(data)) {
				console.error('Unexpected data format:', data);
				return [];
			}
			console.log('Trips fetched successfully:', data);

			const validatedTrips = data
				.map((trip) => {
					const result = getTripsResponseSchema.safeParse(trip);
					if (!result.success) {
						console.error('Validation error for trip:', result.error);
						return null;
					}
					return result.data;
				})
				.filter((trip) => trip !== null);

			return validatedTrips;
		} catch (error) {
			console.error('Error fetching trips:', error);
			return [];
		}
	}

	const trips = await getTrips();

	return {
		user: locals.user,
		trips,
		tripForm: await superValidate(zod(createTripRequestSchema)),
		deleteTrip: await superValidate(zod(deleteTripRequestSchema))
	};
};

export const actions: Actions = {
	createTrip: async ({ request, cookies, locals, fetch }) => {
		console.log('Creating trip with user:', locals.user);
		console.log('Chegou no server action createTrip');

		const form = await superValidate(request, zod(createTripRequestSchema));

		console.log('Form data:', form.data);
		console.log('Form valid:', form.valid);
		console.log('Form errors:', form.errors);

		if (!form.valid) {
			return { form };
		}

		try {
			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				},
				body: JSON.stringify({
					userOwnerId: locals.user.id,
					title: form.data.title,
					destination: form.data.destination,
					startDate: form.data.startDate,
					endDate: form.data.endDate,
					description: form.data.description || 'Teste de descrição'
				})
			};

			const url = new URL('/app/Trips/create', API_URL);

			const response = await fetch(url.toString(), requestOptions);
			if (!response.ok) {
				const errorData = await response.json();
				return {
					form,
					success: false,
					message: errorData.message || 'Erro ao criar a viagem. Por favor, tente novamente.'
				};
			}

			const data = await response.json();

			console.log('Trip created successfully:', data);

			return {
				form,
				success: true,
				message: 'Viagem criada com sucesso!'
			};
		} catch (error) {
			console.error('Error during trip creation:', error);
			return {
				form,
				success: false,
				message: 'Falha ao criar a viagem. Por favor, tente novamente.'
			};
		}

		return { form, success: true, message: 'Viagem criada com sucesso!' };
	},

	removeTrip: async ({ request, cookies, fetch }) => {
		const form = await superValidate(request, zod(deleteTripRequestSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const requestOptions: RequestInit = {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				}
			};

			const url = new URL(`/app/Trips/delete`, API_URL);

			url.searchParams.append('id', form.data.id);

			const response = await fetch(url.toString(), requestOptions);
			if (!response.ok) {
				const errorData = await response.json();
				return {
					form,
					success: false,
					message: errorData.message || 'Erro ao remover a viagem. Por favor, tente novamente.'
				};
			}

			return {
				form,
				success: true,
				message: 'Viagem removida com sucesso!'
			};
		} catch (error) {
			console.error('Error during trip removal:', error);
			return {
				form,
				success: false,
				message: 'Falha ao remover a viagem. Por favor, tente novamente.'
			};
		}
	}
};
