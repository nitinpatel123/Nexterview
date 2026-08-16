import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import * as aiService from "../../services/aiService";

const suggestedPrompts = [
  "How do I prepare for a technical interview?",
  "What skills should I learn for a backend developer role?",
  "How do I negotiate my first salary?",
  "Should I do an internship or focus on projects?",
];

const CareerChat = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI career advisor. Ask me anything about resumes, interviews, skills, or job search — I'm here 24/7." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: messageText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await aiService.sendCareerChatMessage(messageText, newMessages);
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to get a response");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader icon={MessageCircle} title="AI Career Chatbot" subtitle="24×7 career guidance, whenever you need it" />

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <span className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </span>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary-600 text-white rounded-br-sm"
                    : "bg-gray-50 text-gray-700 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                  <User size={16} />
                </span>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-2.5 justify-start">
              <span className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </span>
              <div className="bg-gray-50 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-gray-100 p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a career question..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary-400 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerChat;
