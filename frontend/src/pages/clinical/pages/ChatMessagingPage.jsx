import { useEffect, useState } from "react";
import api from "../../../api";
import { getAccessToken } from "../../../api";

function ChatMessagingPage() {
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newParticipants, setNewParticipants] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [error, setError] = useState("");
  const [connectionState, setConnectionState] = useState("disconnected");

  async function loadThreads() {
    try {
      const { data } = await api.get("/chat/my-threads");
      setThreads(data);
      if (!selectedThreadId && data.length) {
        setSelectedThreadId(data[0].id);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function loadMessages(threadId) {
    if (!threadId) return;
    try {
      const { data } = await api.get(`/chat/threads/${threadId}/messages`);
      setMessages(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    loadMessages(selectedThreadId);
  }, [selectedThreadId]);

  useEffect(() => {
    if (!selectedThreadId) return undefined;
    const pollId = window.setInterval(() => {
      loadMessages(selectedThreadId);
    }, 5000);
    return () => window.clearInterval(pollId);
  }, [selectedThreadId]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return undefined;
    const wsUrl = `ws://localhost:4000/ws/chat?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setConnectionState("connected");
    ws.onclose = () => setConnectionState("disconnected");
    ws.onerror = () => setConnectionState("error");
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "chat.message") {
          if (payload.threadId === selectedThreadId) {
            setMessages((prev) => [...prev, payload.message]);
          }
          loadThreads();
        }
      } catch {
        // Ignore non-JSON socket payloads.
      }
    };

    return () => ws.close();
  }, [selectedThreadId]);

  async function createThread(e) {
    e.preventDefault();
    setError("");
    try {
      const ids = newParticipants
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      await api.post("/chat/threads", { title: newTitle || "Clinical Chat", participantUserIds: ids });
      setNewTitle("");
      setNewParticipants("");
      await loadThreads();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!selectedThreadId || !messageBody.trim()) return;
    setError("");
    try {
      await api.post(`/chat/threads/${selectedThreadId}/messages`, { body: messageBody.trim() });
      setMessageBody("");
      await loadMessages(selectedThreadId);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Chat / Messaging</h2>
        <p className="mt-1 text-slate-600">
          Threaded internal messaging for clinical and front-desk coordination.
        </p>
        <p className="mt-1 text-xs text-slate-500">Realtime: {connectionState} (websocket + polling fallback)</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form className="grid grid-cols-1 gap-3 md:grid-cols-3" onSubmit={createThread}>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Thread title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Participant user IDs (comma separated)"
            value={newParticipants}
            onChange={(e) => setNewParticipants(e.target.value)}
          />
          <button className="h-10 rounded-lg bg-blue-700 px-3 text-white hover:bg-blue-800" type="submit">
            Create Thread
          </button>
        </form>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Threads</h3>
          <div className="mt-3 flex flex-col gap-2">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedThreadId === thread.id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setSelectedThreadId(thread.id)}
              >
                <p className="font-semibold text-slate-900">{thread.title || thread.threadNumber}</p>
                <p className="text-xs text-slate-500">{thread.threadType}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Messages</h3>
          <div className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-slate-100 p-3">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-3 rounded-lg bg-slate-50 p-2">
                <p className="text-xs text-slate-500">{msg.sender?.fullName || msg.sender?.username || "Unknown"}</p>
                <p className="text-sm text-slate-900">{msg.body}</p>
                <p className="text-xs text-slate-500">{msg.sentAt ? new Date(msg.sentAt).toLocaleString() : "-"}</p>
              </div>
            ))}
          </div>
          <form className="mt-3 flex gap-2" onSubmit={sendMessage}>
            <input
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Type message..."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
            />
            <button className="rounded-lg bg-emerald-700 px-3 py-2 text-white hover:bg-emerald-800" type="submit">
              Send
            </button>
          </form>
        </div>
      </section>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export default ChatMessagingPage;

