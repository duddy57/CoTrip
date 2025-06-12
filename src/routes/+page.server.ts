import type { PageServerLoad } from './$types';

// import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// if (locals.user) {
	// 	return redirect(302, '/auth?method=sign-in');
	// }

	return {};
};
