import type { Actions, PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import {
	accessTokenResponseSchema,
	sigInRequestSchema,
	signUpRequestSchema
} from '$lib/schemas/users';
import { zod } from 'sveltekit-superforms/adapters';
import { API_URL } from '$lib';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, '/home');
	}

	return {
		signInForm: await superValidate(zod(sigInRequestSchema)),
		signUpForm: await superValidate(zod(signUpRequestSchema))
	};
};

export const actions: Actions = {
	signUp: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(signUpRequestSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const { email, password, name, confirmPassword } = form.data;

			if (password !== confirmPassword) {
				return { form, success: false, message: 'As senhas não coincidem.' };
			}

			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password, name }),
				mode: 'cors'
			};

			const url = new URL('/app/Users/register', API_URL);

			const response = await fetch(url.toString(), requestOptions);

			console.log('Response from sign-up:', response);
		} catch (error) {
			console.error('Erro durante o login: ', error);
			return { form, success: false, message: 'Falha ao entrar. Por favor, tente novamente.' };
		}
	},
	signIn: async ({ request, fetch, cookies }) => {
		const form = await superValidate(request, zod(sigInRequestSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const { email, password } = form.data;

			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password }),
				mode: 'cors'
			};

			const url = new URL('/app/Users/login', API_URL);

			const response = await fetch(url.toString(), requestOptions);
			const rawData = await response.json();
			if (!response.ok) {
				let errorMessage = 'Erro ao entrar. Por favor, tente novamente.';

				if (rawData.errors) {
					const errorMessages = [];
					for (const key in rawData.errors) {
						if (Array.isArray(rawData.errors[key])) {
							errorMessages.push(...rawData.errors[key]);
						} else {
							errorMessages.push(rawData.errors[key]);
						}
					}
					errorMessage = errorMessages.join(', ');
				} else if (rawData.message) {
					errorMessage = rawData.message;
				} else if (rawData.title) {
					errorMessage = rawData.title;
				}

				return {
					form,
					success: false,
					message: errorMessage,
					errorDetails: rawData.errors || rawData.message || rawData.title
				};
			}

			console.log('Raw data from sign-in:', rawData);

			const result = accessTokenResponseSchema.parse(rawData);

			if (!result.accessToken) {
				return { form, success: false, message: 'Token de acesso não encontrado.' };
			}

			cookies.set('accessToken', result.accessToken, {
				httpOnly: true,
				path: '/',
				maxAge: result.expireAt.getTime() - Date.now()
			});

			return { form, success: true, message: 'Login realizado com sucesso!' };
		} catch (error) {
			console.error('Error during sign-in:', error);
			return { form, success: false, message: 'Falha ao entrar. Por favor, tente novamente.' };
		}
	}
};
