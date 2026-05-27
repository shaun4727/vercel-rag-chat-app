import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST() {
	try {
		const { text } = await generateText({
			model: google('gemini-2.5-flash'),
			prompt: 'Explain what an LLM is in simple terms',
		});

		return Response.json({ text });
	} catch (err) {
		console.log(err);
		return Response.json({ error: 'Failed to generate text' }, { status: 500 });
	}
}
