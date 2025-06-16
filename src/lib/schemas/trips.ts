import { z } from 'zod';

export const createTripRequestSchema = z.object({
	title: z.string().min(1, 'Nome da viagem é obrigatório'),
	destination: z.string().min(1, 'Destino é obrigatório'),
	startDate: z.string().min(1, 'Data de início é obrigatória'),
	endDate: z.string().min(1, 'Data de fim é obrigatória')
});

export const getTripsResponseSchema = z.object({
	id: z.string().optional(),
	userOwnerId: z.string(),
	title: z.string(),
	destination: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	description: z.string().optional(),
	budget: z.number().optional()
});

export const acceptTripInviteRequestSchema = z.object({
	memberId: z.string(),
	tripId: z.string()
});

export const deleteTripRequestSchema = z.object({
	id: z.string().min(1, 'ID da viagem é obrigatório')
});

export type AcceptTripInviteRequestTypeSchema = typeof acceptTripInviteRequestSchema;
export type DeleteTripRequestTypeSchema = typeof deleteTripRequestSchema;
export type CreateTripRequestTypeSchema = typeof createTripRequestSchema;
export type CreateTripResponseTypeSchema = typeof getTripsResponseSchema;
