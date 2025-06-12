import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	const user = locals.user;

	return {
		user,
		id
	};
};
