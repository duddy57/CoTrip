import type { User } from '$lib/schemas/users';
import { writable } from 'svelte/store';

export const userStore = writable<User>({
	id: 'default-id',
	email: 'default-email@example.com',
	name: 'Default Name',
	image: 'default-image.jpg',
	createdAt: new Date()
});
