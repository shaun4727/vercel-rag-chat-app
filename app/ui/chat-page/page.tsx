'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function ChatPage() {
	const [input, setInput] = useState('');

	const { messages, sendMessage, status, error, stop } = useChat({
		transport: new DefaultChatTransport({
			api: '/api/chat', // Move the 'api' property inside the transport constructor
		}),
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendMessage({ text: input });
		setInput('');
	};

	return (
		<div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 border-x border-gray-200">
			{/* Header */}
			<div className="p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
				<h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
			</div>

			{/* Chat History Area */}
			<div className="flex-1 p-4 overflow-y-auto space-y-6 min-w-[640px]">
				{/* Static Chat History (From your original code) */}

				{messages &&
					messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`bg-white border border-gray-200 text-gray-${message.role === 'user' ? '500' : '800'} rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm`}
							>
								{message.parts.map((part, index) => {
									// Check if the part is a text part before rendering
									if (part.type === 'text') {
										return <p key={`part-${index}`}>{part.text}</p>;
									}

									// You can handle tool-invocations or image parts here
									return null;
								})}
							</div>
						</div>
					))}

				{/* Loading State UI */}
				{status === 'submitted' ||
					(status === 'streaming' && (
						<div className="flex justify-start">
							<div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm flex items-center gap-2">
								<span className="flex space-x-1">
									<span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
									<span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
									<span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
								</span>
								<p className="text-sm">Thinking...</p>
							</div>
						</div>
					))}

				{/* Error State UI */}
				{error?.message && (
					<div className="flex justify-center my-4">
						<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{error?.message}
						</div>
					</div>
				)}
			</div>

			{/* Input Area */}
			<div className="p-4 bg-white border-t border-gray-200">
				<form
					onSubmit={(e) => {
						handleSubmit(e);
					}}
					className="flex items-center gap-3 max-w-4xl mx-auto"
				>
					<input
						type="text"
						className="flex-1 px-4 py-3 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
						placeholder="How can I help you?"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						// disabled={isLoading}
					/>
					{status === 'streaming' || status === 'submitted' ? (
						<div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
							<button
								onClick={() => stop()}
								className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-50 transition-colors text-sm font-medium"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
								</svg>
								Stop Generating
							</button>
						</div>
					) : (
						<button
							type="submit"
							// 1. Simplified disabled state
							disabled={!input.trim()}
							className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:hover:bg-black disabled:cursor-not-allowed"
						>
							{/* 2. Simplified text state */}
							Send
						</button>
					)}
				</form>
			</div>
		</div>
	);
}
