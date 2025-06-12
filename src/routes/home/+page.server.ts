import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { createTripRequestSchema } from '$lib/schemas/trips';
import { redirect } from '@sveltejs/kit';
import { API_URL } from '$lib';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/auth?method=sign-in');
	}
	return {
		user: locals.user,
		tripForm: await superValidate(zod(createTripRequestSchema))
	};
};

export const actions: Actions = {
	createTrip: async ({ request, cookies, locals, fetch }) => {
		console.log('Creating trip with user:', locals.user);
		console.log('Chegou no server action createTrip');
		const form = await superValidate(request, zod(createTripRequestSchema));
		if (!form.valid) {
			return { form };
		}

		console.log('Form data:', form.data);

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
					endDate: form.data.endDate
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
		} catch (error) {
			console.error('Error during trip creation:', error);
			return {
				form,
				success: false,
				message: 'Falha ao criar a viagem. Por favor, tente novamente.'
			};
		}

		return { form, success: true, message: 'Viagem criada com sucesso!' };
	}
};
