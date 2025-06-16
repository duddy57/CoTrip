import type { getTripsMembersResponseSchema } from '$lib/schemas/members';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const memberStore = writable<z.infer<typeof getTripsMembersResponseSchema>[]>([]);
