import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

const secret = process.env.JWT_SECRET;

if (!secret) {
	throw new Error("JWT_SECRET environment variable is not set");
}

export const auth = new Elysia({ name: "auth" })
	.use(
		jwt({
			name: "jwt",
			secret: secret,
		}),
	)
	.onBeforeHandle(async ({ path, jwt, status, headers: { authorization } }) => {
		// Only apply auth to routes starting with /api
		if (path.startsWith("/api")) {
			if (!authorization) {
				return status(401);
			}
			const profile = await jwt.verify(authorization);
			if (!profile) {
				return status(401);
			}
		}
	})
	.resolve(async ({ path, jwt, set, headers: { authorization } }) => {
		// Only apply auth to routes starting with /api
		if (path.startsWith("/api")) {
			const profile = await jwt.verify(authorization);

			if (!profile) {
				set.status = 401;
				throw new Error("Unauthorized - Invalid token");
			}
			// Return authenticated user to be available in route handlers
			return {
				user: {
					id: profile.id,
					username: profile.username,
					email: profile.email,
				},
			} as {
				user: {
					id: string;
					username: string;
					email: string;
				};
			};
		}
	})
	.as("global");
