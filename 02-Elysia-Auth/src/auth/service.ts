import { getDB } from "../db";

type User = {
	id: string;
	name: string | null;
	email: string;
};

export const UserService = {
	async registerUser(
		name: string | undefined,
		email: string,
		password: string,
	): Promise<User | false> {
		try {
			const hashedPassword = await Bun.password.hash(password, {
				algorithm: "argon2id",
				memoryCost: 4, // memory usage in kibibytes
				timeCost: 3, // the number of iterations
			});

			const db = getDB();
			const user = await db.user.create({
				data: {
					name: name ?? null,
					email: email,
					password: hashedPassword,
				},
			});

			if (!user) return false;
			return {
				id: user.id,
				name: user.name,
				email: user.email,
			};
		} catch (error) {
			console.error(error);
			return false;
		}
	},
	async loginUser(email: string, password: string): Promise<User | false> {
		try {
			// Find user & validate user
			const db = getDB();
			const user = await db.user.findUnique({
				where: { email: email },
			});

			if (!user) {
				return false;
			}

			// Compare passwords
			const isMatch = await Bun.password.verify(password, user.password);
			if (!isMatch) {
				return false;
			}
			// Return user data
			return {
				id: user.id,
				name: user.name,
				email: user.email,
			};
		} catch (error) {
			console.error(error);
			return false;
		}
	},
};
