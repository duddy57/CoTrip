import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { updateProfileRequestSchema } from '$lib/schemas/users';
import { API_URL } from '$lib';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/auth?method=sign-in');
	}

	return {
		user: locals.user,
		updateProfile: await superValidate(zod(updateProfileRequestSchema))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(updateProfileRequestSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const { image } = form.data;

			const requestOptions: RequestInit = {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ image })
			};

			const url = new URL('/app/Users/updateProfilePicture', API_URL);

			const response = await fetch(url.toString(), requestOptions);
			if (!response.ok) {
				const errorData = await response.json();
				return {
					form,
					success: false,
					message: errorData.message || 'Erro ao entrar. Por favor, tente novamente.'
				};
			}
			const rawData = await response.json();

			console.log('Response from update:', rawData);

			return { form, success: true, message: 'Atualização realizada com sucesso!' };
		} catch (error) {
			console.error('Error during sign-in:', error);
			return { form, success: false, message: 'Falha ao entrar. Por favor, tente novamente.' };
		}
	}
};
