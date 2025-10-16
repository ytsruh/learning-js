import { Elysia } from "elysia";
import { auth as authPlugin } from "../plugins/auth";
import { AuthModel } from "./model";
import { UserService } from "./service";

export const auth = new Elysia()
	.use(authPlugin)
	// Register route
	.post(
		"/auth/register",
		async ({ body, set }) => {
			const { name, email, password, comparePassword } = body;

			if (password !== comparePassword) {
				set.status = 400;
				return { message: "Passwords do not match", data: null };
			}

			const user = await UserService.registerUser(name, email, password);
			if (!user) {
				set.status = 400;
				return { message: "Error creating user", data: null };
			}

			return {
				message: "User registered successfully",
				data: { id: user.id },
			};
		},
		{
			body: AuthModel.registerBody,
			response: AuthModel.registerResponse,
		},
	)
	// Login route
	.post(
		"/auth/login",
		async ({ body, set, jwt }) => {
			const { email, password } = body;

			const user = await UserService.loginUser(email, password);
			if (!user) {
				set.status = 400;
				return { message: "Invalid email or password", data: null };
			}

			// Generate JWT
			const token = await jwt.sign({
				id: user.id,
				email: user.email,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
			});

			return {
				message: "Login successful",
				data: token,
			};
		},
		{
			body: AuthModel.loginBody,
		},
	)
	// Protected profile route
	.get("/auth/profile", async ({ status, jwt, headers: { authorization } }) => {
		// Check if bearer token exists
		const profile = await jwt.verify(authorization);

		if (!profile) return status(401, "Unauthorized");

		// Return user profile from JWT payload
		return {
			profile: profile,
		};
	})
	.get("/api", async ({ user }) => {
		return { special: "data", user: user };
	});
