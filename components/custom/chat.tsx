'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
	const [input, setInput] = useState('');

	const { messages, sendMessage, status, error } = useChat({
		api: '/api/chat',
	});

	const isLoading = status === 'submitted' || status === 'streaming';

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim()) return;

		await sendMessage({
			text: input,
		});

		setInput('');
	};

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
			<div className="flex min-h-[400px] flex-col gap-3 rounded-xl border p-4">
				{messages.length === 0 && (
					<p className="text-sm text-gray-500">Ask something about your uploaded documents...</p>
				)}

				{messages.map((message) => (
					<div
						key={message.id}
						className={`max-w-[80%] rounded-lg p-3 ${
							message.role === 'user' ? 'ml-auto bg-black text-white' : 'bg-gray-100 text-black'
						}`}
					>
						{message.parts.map((part, index) => {
							if (part.type === 'text') {
								return <div key={index}>{part.text}</div>;
							}

							return null;
						})}
					</div>
				))}

				{isLoading && <div className="text-sm text-gray-500">Thinking...</div>}

				{error && <div className="text-sm text-red-500">Something went wrong.</div>}
			</div>

			<form onSubmit={onSubmit} className="flex gap-2">
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask a question..."
					className="flex-1 rounded-lg border p-3 outline-none"
				/>

				<button
					type="submit"
					disabled={isLoading || !input.trim()}
					className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
				>
					Send
				</button>
			</form>
		</div>
	);
}
