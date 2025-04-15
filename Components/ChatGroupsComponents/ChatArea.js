"use client";

import { SendHorizonal } from "lucide-react";

const ChatArea = () => {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-lg min-h-[80vh]">

            </div>

            {/* Input Field */}
            <div className="mt-4 p-2 flex items-center border-t bg-white rounded-b-lg">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-amber-400"
                />
                <button className="ml-2 p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition">
                    <SendHorizonal size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatArea;
