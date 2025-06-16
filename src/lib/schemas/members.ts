import { z } from 'zod';

export const addMemberToTripRequestSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	email: z.string().email('Email inválido').min(1, 'Email é obrigatório')
});

export const removeMemberForTripRequestSchema = z.object({
	memberId: z.string().min(1, 'ID do membro é obrigatório')
});

export type AddMemberToTripRequestTypeSchema = typeof addMemberToTripRequestSchema;
export type RemoveMemberForTripRequestTypeSchema = typeof removeMemberForTripRequestSchema;

export const getTripsMembersResponseSchema = z.object({
	id: z.string(),
	tripId: z.string(),
	name: z.string(),
	email: z.string(),
	inviteStatus: z.number(),
	accessToken: z.string(),
	tokenLifeTime: z.string(),
	tripBalance: z.number()
});

export type GetTripsMembersResponseTypeSchema = typeof getTripsMembersResponseSchema;
