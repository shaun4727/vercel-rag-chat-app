import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();

		const result = streamText({
			model: google('gemini-2.5-flash'),
			messages: await convertToModelMessages(messages),
		});

		return result.toUIMessageStreamResponse();
	} catch (err) {
		console.error('Error streaming chat completion', err);
		return new Response('Failed to stream chat completion', { status: 500 });
	}
}
