import { Hono } from 'hono';
import { stream } from 'hono/streaming';

type Bindings = {
	AI: any;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	const question = c.req.query('text');
	if (!question) {
		return c.text('Please provide a text query');
	}

	const systemPrompt = ``;

	const data = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: question },
		],
	});

	return c.text(data);
});

app.get('/stream', async (c) => {
	const question = c.req.query('text');
	if (!question) {
		return c.text('Please provide a text query');
	}

	const systemPrompt = ``;

	const data = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: question },
		],
		stream: true,
	});

	return stream(c, async (stream) => {
		stream.onAbort(() => {
			console.log('Aborted!');
		});
		await stream.pipe(data);
	});
});

app.onError((err, c) => {
	console.error(err);
	return c.text('An error occurred');
});

export default app;
