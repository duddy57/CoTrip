import z from 'zod';

export const createTripActivitySchema = z.object({
	name: z.string().min(1, 'Nome da atividade é obrigatório'),
	tripId: z.string().min(1, 'ID da viagem é obrigatório'),
	description: z.string().optional(),
	cost: z.number().min(0, 'Custo deve ser um número positivo')
});

export type CreateTripActivityTypeSchema = typeof createTripActivitySchema;

export const getActivitiesResponseSchema = z.object({
	id: z.string().optional(),
	tripId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	cost: z.number().min(0, 'Custo deve ser um número positivo')
});

export type GetActivitiesResponseTypeSchema = typeof getActivitiesResponseSchema;
