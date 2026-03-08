import PropTypes from "prop-types";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-emerald-500 text-slate-950 rounded-br-sm"
            : "bg-slate-900 text-slate-100 rounded-bl-sm border border-slate-800"
        }`}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <p className="whitespace-pre-line">{content}</p>
        )}
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  role: PropTypes.oneOf(["user", "assistant"]).isRequired,
  content: PropTypes.string.isRequired
};

export default MessageBubble;

