import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const InputBox = ({ onSend, isLoading }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "10px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-800 bg-slate-950/90 backdrop-blur flex items-end gap-2 px-4 py-3"
    >
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your life problem and press Enter to debug..."
          className="w-full resize-none rounded-2xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />
      </div>
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-slate-950 transition-colors"
        aria-label="Send message"
      >
        {isLoading ? (
          <span className="h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        )}
      </button>
    </form>
  );
};

InputBox.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default InputBox;

