'use client';

export default function CompletionPage() {
	return (
		<div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 border-x border-gray-200">
			{/* Header */}
			<div className="p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
				<h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
			</div>

			{/* Chat History Area */}
			<div className="flex-1 p-4 overflow-y-auto space-y-6">
				{/* AI / Assistant Message */}
				<div className="flex justify-start">
					<div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
						<p>Hello! How can I help you today?</p>
					</div>
				</div>

				{/* User Message */}
				<div className="flex justify-end">
					<div className="bg-black text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-sm">
						<p>Can you help me redesign my Next.js component into a chat interface?</p>
					</div>
				</div>

				{/* Second AI Message to show flow */}
				<div className="flex justify-start">
					<div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
						<p>
							Absolutely. I have prepared a static layout for you using Tailwind CSS. The input area is
							fixed to the bottom, and this message area will scroll naturally as the conversation grows.
						</p>
					</div>
				</div>
			</div>

			{/* Input Area */}
			<div className="p-4 bg-white border-t border-gray-200">
				<form action="" className="flex items-center gap-3 max-w-4xl mx-auto">
					<input
						type="text"
						placeholder="Message the assistant..."
						className="flex-1 px-4 py-3 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all"
					/>
					<button
						type="submit"
						className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
}
