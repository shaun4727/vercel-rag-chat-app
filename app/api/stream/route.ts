import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
	try {
		const { prompt } = await req.json();
		const result = streamText({
			model: google('gemini-2.5-flash'),
			prompt,
		});

		return result.toUIMessageStreamResponse();
	} catch (err) {
		console.log(err);
		return new Response('Failed to stream text', { status: 500 });
	}
}
