import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { api, endpoints } from '../lib/index.js';

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your StatSkill AI statistical learning co-pilot. Ask me about your competency gaps, recommended courses, or statistical methodologies.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post(endpoints.assistant, { question: text });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer || 'I am ready to help you navigate your official statistical learning pathway.',
          source: res.source,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach the AI assistant right now. Please check that the server is running.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'What should I learn next?',
    'Why is Python recommended?',
    'Explain my biggest skill gap',
    'Give me a 7-day learning plan',
    'Generate 5 questions on sampling',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--accent, #1d4ed8)' }}
          aria-label="Open AI Assistant"
        >
          <Sparkles size={18} />
          <span>Ask AI Assistant</span>
        </button>
      )}

      {open && (
        <div className="flex h-[520px] w-96 flex-col rounded-2xl border border-hairline bg-surface shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline bg-surface-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white" style={{ background: 'var(--accent, #1d4ed8)' }}>
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">StatSkill AI Assistant</h3>
                <p className="text-[11px] text-ink-2">MoSPI & NSSTA Co-pilot</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-ink-2 hover:bg-surface hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-hairline bg-surface px-3 py-2 text-xs scrollbar-none">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="shrink-0 rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] text-ink-2 hover:border-accent hover:text-ink transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-accent text-white rounded-br-sm'
                      : 'bg-surface-2 text-ink border border-hairline rounded-bl-sm'
                  }`}
                  style={m.role === 'user' ? { background: 'var(--accent, #1d4ed8)' } : {}}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.source && (
                    <span className="mt-1 block text-[10px] text-ink-muted">
                      Source: {m.source}
                    </span>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-xs text-ink-muted">
                <Bot size={14} className="animate-spin" />
                <span>Analyzing your statistical learning path...</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-hairline bg-surface p-3 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about official statistics or your path..."
              className="field text-xs flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary text-xs px-3 py-1.5 flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

