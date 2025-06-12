import { API_URL } from '$lib';
import type { Handle } from '@sveltejs/kit';
import { userSchema } from '$lib/components/schemas/users';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.locals.user) {
		return await resolve(event);
	}

	try {
		const url = new URL('/app/Users/profile', API_URL);

		if (!event.cookies.get('accessToken')) {
			console.warn('Token de acesso não encontrado, usuário não autenticado.');
			return await resolve(event);
		}

		const usersRes = await event.fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${event.cookies.get('accessToken')}`
			},
			mode: 'cors'
		});

		if (!usersRes.ok) {
			console.warn(`Erro ao buscar perfil do usuário: ${usersRes.status} ${usersRes.statusText}`);
			return await resolve(event);
		}

		const usersRawData = await usersRes.json();

		const usersResult = userSchema.parse(usersRawData);

		event.locals.user = usersResult;

		console.log('Usuário autenticado:', usersResult.id || usersResult.email || 'Desconhecido');
	} catch (error) {
		console.error('Erro no hook de autenticação:', error);

		event.locals.user = null;
	}

	return await resolve(event);
};
