import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";

const AIAdvisor = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: "ai", text: "Hello! I'm your Paisafy AI Advisor. How can I help you optimize your finances today?" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Mock AI Response
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                sender: "ai",
                text: "That's a great question! Based on general financial principles, it's recommended to follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Would you like me to analyze your current budget?"
            };
            setMessages((prev) => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-primary-600 px-6 py-4 flex items-center gap-3 text-white">
                <div className="p-2 rounded-full bg-white/20">
                    <FaRobot className="text-xl" />
                </div>
                <div>
                    <h2 className="font-bold">AI Financial Advisor</h2>
                    <p className="text-xs text-primary-100">Always here to help</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-primary-100 text-primary-600'}`}>
                                {msg.sender === 'user' ? <FaUser className="text-sm" /> : <FaRobot className="text-sm" />}
                            </div>
                            <div className={`rounded-2xl px-4 py-3 text-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'}`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="Ask for financial advice..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-500 transition-colors"
                        disabled={!input.trim()}
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIAdvisor;
