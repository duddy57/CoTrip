import { z } from 'zod';

export const sigInRequestSchema = z.object({
	email: z.string().email('Email invalido'),
	password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

export const signUpRequestSchema = z
	.object({
		name: z.string().min(1, 'Nome é obrigatório'),
		email: z.string().email('Email invalido'),
		password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
		confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não conferem',
		path: ['confirmPassword']
	});

export const accessTokenResponseSchema = z.object({
	accessToken: z.string(),
	expireAt: z.coerce.date()
});
export const userSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	image: z.string().optional(),
	createdAt: z.coerce.date()
});

export const updateProfileRequestSchema = z.object({
	// name: z.string().min(1, 'Nome é obrigatório'),
	image: z.string().optional()
});

export type UpdateProfileRequestTypeSchema = z.infer<typeof updateProfileRequestSchema>;
export type User = z.infer<typeof userSchema>;
export type SignInTypeSchema = typeof sigInRequestSchema;
export type SignUpTypeSchema = typeof signUpRequestSchema;
export type AccessTokenResponseTypeSchema = z.infer<typeof accessTokenResponseSchema>;
