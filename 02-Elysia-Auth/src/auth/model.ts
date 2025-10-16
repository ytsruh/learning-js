import { z } from "zod";

export namespace AuthModel {
	export const registerBody = z.object({
		name: z.string().optional(),
		email: z.email(),
		password: z.string().min(6),
		comparePassword: z.string().min(6),
	});

	export const registerResponse = z.object({
		message: z.string(),
		data: z
			.object({
				id: z.string(),
			})
			.nullable(),
	});

	export const loginBody = z.object({
		email: z.email(),
		password: z.string(),
	});
}
