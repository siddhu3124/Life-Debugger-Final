import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle close sidebar event from Sidebar component
  useEffect(() => {
    const handleCloseSidebar = () => setSidebarOpen(false);
    window.addEventListener('closeSidebar', handleCloseSidebar);
    return () => window.removeEventListener('closeSidebar', handleCloseSidebar);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("ld_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/problems/history");
        setHistory(response.data.problems || []);
      } catch (error) {
        console.error("Failed to fetch history", error);
      }
    };

    fetchHistory();
  }, []);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSelectChat = (item) => {
    setActiveChatId(item.id);
    setMessages([
      {
        id: `${item.id}-user`,
        role: "user",
        content: item.problem
      },
      {
        id: `${item.id}-assistant`,
        role: "assistant",
        content: item.aiResponse
      }
    ]);
  };

  const handleDeleteChat = async (item) => {
    try {
      await api.delete(`/problems/${item.id}`);
      setHistory((prev) => prev.filter((p) => p.id !== item.id));
      if (activeChatId === item.id) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete problem", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ld_token");
    localStorage.removeItem("ld_user");
    navigate("/login", { replace: true });
  };

  const handleSend = async (text, category = "general") => {
    const tempUserMessageId = `user-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: tempUserMessageId, role: "user", content: text }
    ]);

    setIsLoading(true);

    try {
      const response = await api.post("/problems/add", {
        problem: text,
        category
      });

      const created = response.data.problem;

      const aiMessage = {
        id: `assistant-${created.id}`,
        role: "assistant",
        content: created.aiResponse
      };

      setMessages((prev) => [...prev, aiMessage]);
      setActiveChatId(created.id);
      setHistory((prev) => {
        const existing = prev.filter((p) => p.id !== created.id);
        return [created, ...existing];
      });
    } catch (error) {
      console.error("Failed to send problem", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "I ran into an issue while analyzing your problem. Please try again in a moment."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-slate-950 text-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 h-full transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          history={history}
          activeChatId={activeChatId}
          onSelectChat={(item) => {
            handleSelectChat(item);
            setSidebarOpen(false);
          }}
          onNewChat={() => {
            handleNewChat();
            setSidebarOpen(false);
          }}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            {/* Hamburger Menu Button - Mobile only */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            {user?.name ? (
              <span className="text-sm font-medium text-slate-200">
                Welcome, <span className="text-emerald-400">{user.name}</span>
              </span>
            ) : (
              <span className="text-sm font-medium text-slate-200">
                Welcome!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-medium text-slate-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 hover:bg-red-900/40 border border-slate-700 hover:border-red-800 px-3 py-2 text-xs font-medium text-slate-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

