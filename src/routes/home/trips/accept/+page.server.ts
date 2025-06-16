import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { acceptTripInviteRequestSchema } from '$lib/schemas/trips';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { API_URL } from '$lib';

export const load: PageServerLoad = async ({ url, locals }) => {
	const memberId = url.searchParams.get('memberId');
	const tripId = url.searchParams.get('tripId');

	if (!locals.user) {
		return redirect(
			302,
			`/auth?method=sign-in?next=/home/trips/accept?memberId=${memberId}&tripId=${tripId}`
		);
	}

	if (!memberId || !tripId) {
		return redirect(302, '/home/trips');
	}

	return {
		memberId,
		tripId,
		acceptTrip: await superValidate(zod(acceptTripInviteRequestSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const form = await superValidate(request, zod(acceptTripInviteRequestSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const inviteURL = new URL('/app/Members/acceptInvite', API_URL);

			inviteURL.searchParams.set('memberIdMagic', form.data.memberId);
			inviteURL.searchParams.set('tripIdMagic', form.data.tripId);

			const requestInviteOptions: RequestInit = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				}
			};

			const sendInvite = await fetch(inviteURL.toString(), requestInviteOptions);

			if (!sendInvite.ok) {
				throw new Error('Failed to send invite');
			}

			return { form, status: 200, body: { success: true } };
		} catch (error) {
			if (error instanceof Error) {
				return { form, status: 500, body: { error: error.message } };
			}
		}
	}
};
