import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { getTripsResponseSchema } from '$lib/schemas/trips';
import { API_URL } from '$lib';
import { redirect } from '@sveltejs/kit';
import {
	addMemberToTripRequestSchema,
	getTripsMembersResponseSchema,
	removeMemberForTripRequestSchema
} from '$lib/schemas/members';
import { createTripActivitySchema, getActivitiesResponseSchema } from '$lib/schemas/activities';

export const load: PageServerLoad = async ({ params, locals, cookies, fetch }) => {
	if (!locals.user) {
		return redirect(302, '/auth?method=sign-in');
	}

	const { id } = params;

	async function getTrip() {
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

			if (!response.ok) {
				console.error('API request failed:', response.status, response.statusText);
				return null;
			}

			const allTrips = await response.json();

			if (!allTrips || !Array.isArray(allTrips)) {
				console.error('Unexpected data format:', allTrips);
				return null;
			}

			const tripData = allTrips.find((trip: { id: string }) => trip.id === id);

			if (!tripData) {
				console.error('Trip not found in list');
				return null;
			}

			console.log('Trip found in list:', tripData);

			const result = getTripsResponseSchema.safeParse(tripData);
			if (!result.success) {
				console.error('Validation error for trip:', result.error);
				return null;
			}

			return result.data;
		} catch (error) {
			console.error('Error fetching trip:', error);
			return null;
		}
	}

	async function getMembers() {
		try {
			const url = new URL(`/app/Members/listMembers`, API_URL);

			url.searchParams.set('tripId', id);

			console.log('Fetching members from:', url.toString());

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

			const validatedMembers = data
				.map((member) => {
					const result = getTripsMembersResponseSchema.safeParse(member);
					if (!result.success) {
						console.error('Validation error for member:', result.error);
						return null;
					}
					return result.data;
				})
				.filter((member) => member !== null);

			return validatedMembers;
		} catch (error) {
			console.error('Error fetching trips:', error);
			return [];
		}
	}
	async function getActivities() {
		try {
			const url = new URL(`/app/Activities/listActivities`, API_URL);

			url.searchParams.set('tripId', id);

			console.log('Fetching activities from:', url.toString());

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

			const validatedActivities = data
				.map((activity) => {
					const result = getActivitiesResponseSchema.safeParse(activity);
					if (!result.success) {
						console.error('Validation error for activity:', result.error);
						return null;
					}
					return result.data;
				})
				.filter((activity) => activity !== null);

			return validatedActivities;
		} catch (error) {
			console.error('Error fetching trips:', error);
			return [];
		}
	}

	const trip = await getTrip();
	const members = await getMembers();
	const activities = await getActivities();

	console.log('Trip:', trip);
	console.log('Members:', members);
	console.log('Activities:', activities);

	if (!trip) {
		throw new Error(`Trip with ID ${id} not found`);
	}

	return {
		user: locals.user,
		id,
		trip,
		members,
		activities,
		addMember: await superValidate(zod(addMemberToTripRequestSchema)),
		addActivity: await superValidate(zod(createTripActivitySchema)),
		removeMember: await superValidate(zod(removeMemberForTripRequestSchema))
	};
};

export const actions: Actions = {
	// Create actions
	addMember: async ({ request, params, locals, cookies }) => {
		const { id } = params;
		const user = locals.user;

		if (!user) {
			return { status: 401, error: new Error('Unauthorized') };
		}

		const form = await superValidate(request, zod(addMemberToTripRequestSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const url = new URL('/app/Members/create', API_URL);

			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				},
				body: JSON.stringify({
					tripId: id,
					name: form.data.name,
					email: form.data.email
				})
			};

			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				throw new Error('Failed to add member');
			}

			const inviteURL = new URL('/app/Members/inviteMembers', API_URL);

			inviteURL.searchParams.set('tripId', id);

			const requestInviteOptions: RequestInit = {
				method: 'PATCH',
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
	},
	addActivity: async ({ request, params, locals, cookies }) => {
		const { id } = params;
		const user = locals.user;

		if (!user) {
			return { status: 401, error: new Error('Unauthorized') };
		}

		const form = await superValidate(request, zod(createTripActivitySchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const url = new URL('/app/Activities/create', API_URL);

			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				},
				body: JSON.stringify({
					tripId: id,
					name: form.data.name,
					description: form.data.description,
					cost: form.data.cost
				})
			};

			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				throw new Error('Failed to add activity');
			}

			return { form, status: 200, body: { success: true } };
		} catch (error) {
			if (error instanceof Error) {
				return { form, status: 500, body: { error: error.message } };
			}
		}
	},

	//Remove actions
	removeMember: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(removeMemberForTripRequestSchema));
		if (!form.valid) {
			return { form };
		}

		try {
			const url = new URL('/app/Members/removeMember', API_URL);

			url.searchParams.set('memberId', form.data.memberId);

			const requestInviteOptions: RequestInit = {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				}
			};

			const response = await fetch(url.toString(), requestInviteOptions);

			if (!response.ok) {
				throw new Error('Failed to remove members');
			}

			return { form, status: 200, body: { success: true } };
		} catch (error) {
			if (error instanceof Error) {
				return { form, status: 500, body: { error: error.message } };
			}
		}
	}
	// removeActivity: async ({ request, params, locals, cookies }) => {}
};
