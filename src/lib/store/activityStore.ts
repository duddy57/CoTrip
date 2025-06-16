import type { getActivitiesResponseSchema } from '$lib/schemas/activities';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const activityStore = writable<z.infer<typeof getActivitiesResponseSchema>[]>([]);
