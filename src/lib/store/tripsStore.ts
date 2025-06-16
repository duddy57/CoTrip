import { getTripsResponseSchema } from '$lib/schemas/trips';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const tripStore = writable<z.infer<typeof getTripsResponseSchema>[]>([]);

export const removeTrip = (id: string | number) => {
	tripStore.update((trips) => trips.filter((trip) => trip.id !== id));
};
