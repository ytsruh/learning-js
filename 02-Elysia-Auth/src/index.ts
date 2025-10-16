import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { auth } from "./auth";
import { initializeDB } from "./db";
import { envVarCheck } from "./lib/utils";
import { etag } from "./plugins/etag";
import { logger } from "./plugins/logger";
import { requestID } from "./plugins/requestid";

console.log("-----Server setup-----");
envVarCheck();
await initializeDB();
console.log("-----Server setup-----");

export const app = new Elysia()
	.use(cors())
	.use(logger())
	.use(etag())
	.use(requestID())
	.get("/", ({ set, status }) => {
		set.headers = { "X-Teapot": "true" };
		return status(418, "I am a teapot");
	})
	.use(auth)
	.onError((ctx) => {
		if (ctx.code === "NOT_FOUND") return ctx.status(404, "Not Found :(");
		console.log(`Error: ${ctx.code} - ${ctx.status}`);
		return ctx.status(500, "Internal Server Error");
	})
	.listen(3000, (app) => {
		console.log(`🚀 running on http://${app.hostname}:${app.port}`);
	});
