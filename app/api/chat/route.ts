// src/app/api/chat/route.ts

import prisma from '@/lib/prisma';

import { google } from '@ai-sdk/google';

import { convertToModelMessages, embed, streamText, type UIMessage } from 'ai';

export const runtime = 'nodejs';

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json();

		// Extract latest user text from message parts
		const lastMessage = messages[messages.length - 1];

		const userQuery = lastMessage.parts
			.filter((part) => part.type === 'text')
			.map((part) => part.text)
			.join(' ');

		// Generate embedding
		const { embedding } = await embed({
			model: google.embedding('gemini-embedding-001'),
			value: userQuery,
		});

		// Vector similarity search
		const similarDocs = await prisma.$queryRaw<{ content: string; similarity: number }[]>`
      SELECT
        content,
        1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
      FROM "Document"
      WHERE embedding IS NOT NULL
      ORDER BY similarity DESC
      LIMIT 5
    `;

		// Build context
		const contextData = similarDocs.map((doc) => doc.content).join('\n\n---\n\n');

		// System prompt
		const systemPrompt = `
You are an intelligent RAG assistant.

Answer ONLY using the provided context.

If the answer is not present in the context,
say you do not know.

<context>
${contextData}
</context>
`;

		// Generate streaming response
		const result = streamText({
			model: google('gemini-1.5-flash'),

			system: systemPrompt,

			// REQUIRED in AI SDK v5
			messages: convertToModelMessages(messages),
		});

		// REQUIRED in AI SDK v5
		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error('CHAT API ERROR:', error);

		return Response.json(
			{
				error: 'Internal Server Error',
			},
			{
				status: 500,
			},
		);
	}
}
