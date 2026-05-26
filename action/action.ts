'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';

import { google } from '@ai-sdk/google';
import { embed } from 'ai';

import { revalidatePath } from 'next/cache';

export async function ingestDocument(formData: FormData) {
	try {
		// Verify authentication
		const session = await auth();

		if (!session?.user?.id) {
			throw new Error('Unauthorized');
		}

		// Get content
		const content = formData.get('content');

		if (typeof content !== 'string') {
			throw new Error('Invalid content');
		}

		if (!content.trim()) {
			throw new Error('Content is empty');
		}

		// Generate embedding
		const { embedding } = await embed({
			model: google.embedding('gemini-embedding-001'),
			value: content,
		});

		// Create document
		const document = await prisma.document.create({
			data: {
				content,
				userId: session.user.id,
			},
		});

		// Store vector embedding
		await prisma.$executeRaw`
      UPDATE "Document"
      SET embedding = ${JSON.stringify(embedding)}::vector
      WHERE id = ${document.id}
    `;

		revalidatePath('/');

		return {
			success: true,
		};
	} catch (error) {
		console.error('INGEST ERROR:', error);

		return {
			success: false,
			error: 'Failed to ingest document',
		};
	}
}
