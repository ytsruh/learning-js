import { describe, expect, test } from "bun:test";
import { app } from "../src";

describe("Server start", () => {
	test("GET /", async () => {
		const request = new Request("http://localhost/");
		const response = await app.handle(request).then(async (res) => {
			return { text: await res.text(), status: res.status };
		});
		expect(response.text).toEqual("I am a teapot");
		expect(response.status).toBe(418);
	});

	test("404 not found handler", async () => {
		const req = new Request("http://localhost/random-url");
		const res = await app.fetch(req);
		expect(res.status).toBe(404);
	});
});
