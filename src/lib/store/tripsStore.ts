import type { createTripResponseSchema } from '$lib/schemas/trips';
import { writable } from 'svelte/store';
import { z } from 'zod';

const defaultTrip: z.infer<typeof createTripResponseSchema> = {
	id: '1',
	title: 'Viagem de teste',
	destination: 'Paris, França',
	startDate: '2024-06-15',
	endDate: '2024-06-22'
};

export const tripStore = writable<z.infer<typeof createTripResponseSchema>[]>([defaultTrip]);
