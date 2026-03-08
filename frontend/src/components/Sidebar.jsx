import { useState, useMemo } from "react";
import PropTypes from "prop-types";

const Sidebar = ({ history, activeChatId, onSelectChat, onNewChat, onDeleteChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set(history.map((item) => item.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.problem
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [history, searchQuery, selectedCategory]);

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-slate-800">
        <div className="flex items-start justify-between">
          {/* Close button for mobile */}
          <button
            onClick={() => {
              // Dispatch custom event to close sidebar
              window.dispatchEvent(new CustomEvent('closeSidebar'));
            }}
            className="lg:hidden p-1 rounded hover:bg-slate-800 transition-colors mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <img 
                src="https://static.vecteezy.com/system/resources/previews/027/247/135/non_2x/green-june-beetle-bug-isolated-on-transparent-background-ai-generated-png.png"
                alt="Life Debugger Logo"
                className="w-6 h-6 object-contain"
              />
              <h1 className="text-sm font-semibold tracking-tight">
                Life <span className="text-emerald-400">Debugger </span>
              </h1>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              AI-powered life problem solver
            </p>
          </div>
        </div>
        <button
          onClick={onNewChat}
          className="mt-4 w-full justify-center inline-flex items-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-medium text-slate-100 transition-colors"
        >
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-md bg-emerald-500 text-[11px] text-slate-950">
            +
          </span>
          New Chat
        </button>
      </div>

      <div className="px-3 py-2 border-b border-slate-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
              </svg>
            </button>
          )}
        </div>
        {categories.length > 1 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {filteredHistory.length === 0 ? (
          <p className="px-4 py-4 text-xs text-slate-500">
            {history.length === 0
              ? "Your recent conversations will appear here once you start debugging your life."
              : "No conversations match your search."}
          </p>
        ) : (
          <ul className="py-2 text-xs">
            {filteredHistory.map((item) => (
              <li key={item.id}>
                <div
                  className={`w-full px-4 py-2.5 flex flex-col gap-1 transition-colors group ${
                    activeChatId === item.id
                      ? "bg-slate-900/80"
                      : "hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onSelectChat(item)}
                      className="flex-1 text-left"
                    >
                      {item.category && item.category !== "general" && (
                        <span className="text-[10px] text-emerald-400 uppercase tracking-wider">
                          {item.category} &bull;{" "}
                        </span>
                      )}
                      <span className="font-medium text-slate-100 line-clamp-2">
                        {item.problem}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(item);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900/40 rounded transition-all"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-3.5 h-3.5 text-slate-400 hover:text-red-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.355 15h5.29a1.5 1.5 0 001.495-.85l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zm-.75 5.5v3.25h1.5V9h-1.5zm3 0v3.25h1.5V9h-1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Company Info Footer */}
      <div className="mt-auto px-3 py-3 border-t border-slate-800 bg-slate-900/40">
        <div className="text-[10px] text-slate-500 space-y-1.5">
          <div className="font-semibold text-emerald-400/80">
            Life Debugger
          </div>
          {/* Phone Icon */}
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.905 1.376l2.808 1.26a2.25 2.25 0 001.808 1.258h2.38a2.25 2.25 0 001.805-1.555l2.81-1.26A2.25 2.25 0 0020.18 5H21a3 3 0 013 3v10.5a3 3 0 01-3 3h-1.372a3 3 0 01-1.905-1.376l-2.808-1.26a2.25 2.25 0 00-1.808-1.258H8.632a2.25 2.25 0 00-1.805 1.555l-2.81 1.26A2.25 2.25 0 003 19.5V4.5z" clipRule="evenodd" />
            </svg>
            <span>+91 6300500266</span>
          </div>
          {/* Email Icon */}
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22 5.842V20.25a2.25 2.25 0 01-2.248 2.25H4.248a2.25 2.25 0 01-2.248-2.25V5.842l9.478 5.869a.75.75 0 01.544.284V5.13a.75.75 0 01.344-.54l9.6-5.87z" />
            </svg>
            <span className="truncate">siddhupappuu@gmail.com</span>
          </div>
          {/* Location Icon */}
          <div className="flex items-start gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zm.52 2.16c-.645 2.219-2.91 5.062-5.523 6.882a25.867 25.867 0 01-5.108 3.453.75.75 0 01-.923-.516 24.555 24.555 0 0012.38-4.834 24.629 24.629 0 00-1.847-5.965.75.75 0 01.5-.7z" clipRule="evenodd" />
              <path d="M13.503 7.047a.75.75 0 00-1.006.04l-3.013 3.013a.75.75 0 001.006 1.006l3.013-3.013a.75.75 0 00-.04-1.006z" />
            </svg>
            <span>Nanakramguda, Hyderabad</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800/50 mt-2">
            © 2026 Life Debugger. All rights reserved.
          </div>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      problem: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      category: PropTypes.string
    })
  ).isRequired,
  activeChatId: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired
};

export default Sidebar;

