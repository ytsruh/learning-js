import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";
import App from "./views/App";

await Bun.build({
	entrypoints: ["./src/views/index.tsx"],
	outdir: "./public",
});

new Elysia()
	.use(staticPlugin())
	.get("/", async () => {
		// create our react App component
		const app = createElement(App);

		// render the app component to a readable stream
		const stream = await renderToReadableStream(app, {
			bootstrapScripts: ["/public/index.js"],
		});

		// output the stream as the response
		return new Response(stream, {
			headers: { "Content-Type": "text/html" },
		});
	})
	.listen(3000, (app) => {
		console.log(`🦊 Elysia is running on http://${app.hostname}:${app.port}`);
	});
