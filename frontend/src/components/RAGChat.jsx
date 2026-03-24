import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function RAGChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your NLP Inventory Assistant. What kind of car are you looking for?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", { user_message: userMessage });
      setMessages(prev => [...prev, { sender: "bot", text: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I'm having trouble connecting to the NLP engine right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", border: "1px solid var(--primary)", display: "flex", flexDirection: "column", height: "450px" }}>
      <div style={{ marginBottom: "16px", textAlign: "center", borderBottom: "1px solid rgba(141,187,1,0.2)", paddingBottom: "12px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--navy)", marginBottom: "4px" }}>Inventory Assistant</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>Search via natural language (e.g. "hybrid honda auto")</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "8px", marginBottom: "16px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.sender === "user" ? "var(--primary)" : "var(--background)",
            color: msg.sender === "user" ? "white" : "var(--text)",
            padding: "10px 14px",
            borderRadius: msg.sender === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
            maxWidth: "85%",
            border: msg.sender === "bot" ? "1px solid rgba(0,0,0,0.1)" : "none",
            fontSize: "14px",
            whiteSpace: "pre-line",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", padding: "10px 14px", backgroundColor: "var(--background)", borderRadius: "16px 16px 16px 0", border: "1px solid rgba(0,0,0,0.1)", fontSize: "14px", color: "var(--text-muted)" }}>
            Searching database...
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        <input 
          className="input" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your search here..." 
          style={{ flex: 1, borderRadius: "24px" }}
          disabled={loading}
        />
        <button type="submit" className="btn btnPrimary" style={{ borderRadius: "24px", padding: "0 24px" }} disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
