import { useState, useRef, useEffect } from "react";
import { generateSystemInstruction } from "../../../data/Realdata/aiData";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL   = "llama-3.3-70b-versatile";

const STATS = [
  { num: "4+",  label: "Projects" },
  { num: "1+",  label: "Yrs coding" },
  { num: "10+", label: "Technologies" },
  { num: "7.5", label: "CGPA / 10" },
];

export default function About() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm Ravi's AI assistant. Ask me anything about his skills, projects, education, or experience!",
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const historyRef  = useRef([]);
  const chatBodyRef = useRef(null);


  useEffect(() => {
    const el = chatBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);


  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    historyRef.current.push({ role: "user", content: msg });

    try {
      const key = import.meta.env.VITE_APP_GROQ_API_KEY;
      if (!key) throw new Error("Groq API key missing");

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: generateSystemInstruction() },
            ...historyRef.current,
          ],
          temperature: 0.7,
          max_tokens: 300,
          stream: false,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
      }

      const data  = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error("Empty response");

      historyRef.current.push({ role: "assistant", content: reply });
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);

    } catch (err) {
      console.error("Groq Error:", err.message);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="about" className="about-section">
      <div className="section-wrap">

        <div className="about-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-sub">
            A full-stack developer who loves building things that matter.
          </p>
        </div>

        <div className="about-grid">

          <div className="about-left">
            <div className="about-photo-frame">
              <img
                className="about-photo"
                src="https://d1jd6j7xdf8x95.cloudfront.net/images/profile_image.png"
                alt="Ravi Bhushan"
              />
              <div className="about-photo-border" />
              <span className="about-photo-badge">Full-Stack Dev · MERN</span>
            </div>
            <p className="about-bio">
              I'm <strong>Ravi Bhushan</strong>, a B.Tech CSE student at CT
              Institute (2023–2027), based in Bihar, India. I specialise in the{" "}
              <strong>MERN stack</strong> — building secure auth systems,
              full-stack tools, and AI-powered apps. Driven by clean code, real
              impact, and shipping things people love.
            </p>
          </div>

          <div className="about-right">
            <div className="chat-panel">
              <div className="chat-topbar">
                <div className="chat-avatar">RB</div>
                <div className="chat-topbar-info">
                  <div className="chat-topbar-name">Ravi's AI Assistant</div>
                  <div className="chat-topbar-status">Online</div>
                </div>
              </div>

              <div className="chat-messages" ref={chatBodyRef}>
                {messages.map((m, i) => (
                  <div key={i} className={"chat-msg " + m.role}>
                    <div className="chat-msg-avatar">
                      {m.role === "bot" ? "AI" : "You"}
                    </div>
                    <div className="chat-bubble">{m.text}</div>
                  </div>
                ))}
                {loading && (
                  <div className="chat-msg bot">
                    <div className="chat-msg-avatar">AI</div>
                    <div className="chat-bubble">
                      <div className="typing-indicator">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form
                className="chat-input-row"
                onSubmit={(e) => { e.preventDefault(); send(); }}
              >
                <input
                  className="chat-input-field"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about skills, projects, experience..."
                  disabled={loading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          <div className="about-stats">
            {STATS.map(({ num, label }) => (
              <div key={label} className="about-stat">
                <div className="about-stat-num">{num}</div>
                <div className="about-stat-label">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
