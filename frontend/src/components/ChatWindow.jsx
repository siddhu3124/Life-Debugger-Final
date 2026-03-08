import { useState } from "react";
import PropTypes from "prop-types";
import MessageBubble from "./MessageBubble.jsx";
import InputBox from "./InputBox.jsx";

const ChatWindow = ({ messages, onSend, isLoading }) => {
  const [category, setCategory] = useState("general");

  const categories = [
    "general",
    "work",
    "personal",
    "health",
    "relationships",
    "career",
    "finance"
  ];

  const handleSend = (text) => {
    onSend(text, category);
  };

  return (
    <section className="flex flex-col h-full">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Life <span className="text-emerald-400">Debugger</span>
          </h2>
          <p className="text-xs text-slate-500">
            Describe what&apos;s going on. I&apos;ll help you find the cause
            and a simple plan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 space-y-2 scrollbar-thin scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-md text-center">
              <p className="text-sm text-slate-400 mb-2">
                Start a new conversation and tell Life Debugger what you&apos;re
                struggling with.
              </p>
              <p className="text-xs text-slate-500">
                For example: "I feel stuck in my career and don&apos;t
                know what to do next."
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))
        )}
      </div>

      <InputBox onSend={handleSend} isLoading={isLoading} />
    </section>
  );
};

ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.oneOf(["user", "assistant"]).isRequired,
      content: PropTypes.string.isRequired
    })
  ).isRequired,
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ChatWindow;

