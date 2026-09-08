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
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

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

  const QUICK_PROMPTS = [
    'Explain sampling methodology',
    'Recommend courses for Python',
    'Why is my AI/ML gap high?',
    'Create MCQs about this topic',
    'Create a revision plan',
  ];

  return (
    <>
      {/* Open Button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          aria-label="Open AI Assistant"
        >
          <Sparkles size={18} />
          <span>Ask StatSkill AI</span>
        </button>
      )}

      {/* Chat Drawer */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[440px] rounded-2xl border border-hairline bg-surface shadow-2xl overflow-hidden flex flex-col animate-scale-in">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-hairline bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-accent text-white shadow-sm">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">StatSkill AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-status-good animate-pulse" />
                  <p className="text-[11px] text-ink-2">MoSPI & NSSTA Co-pilot</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex gap-1.5 overflow-x-auto px-4 py-3 border-b border-hairline/50 scrollbar-none">
            {QUICK_PROMPTS.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="shrink-0 rounded-full border border-hairline bg-surface-2 px-3 py-1.5 text-[11px] text-ink-2 hover:border-primary hover:text-primary hover:bg-primary-light transition-all whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[320px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-accent text-white rounded-br-sm'
                      : 'bg-surface-2 text-ink border border-hairline rounded-bl-sm'
                  }`}
                  style={m.role === 'user' ? { background: 'var(--gradient-accent)' } : {}}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.source && (
                    <span className="mt-1 block text-[10px] opacity-60">
                      Source: {m.source}
                    </span>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-ink-muted">
                <Bot size={14} className="animate-spin text-primary" />
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1">Analyzing your statistical learning path...</span>
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-hairline bg-surface p-3 flex gap-2"
          >
            <input
              ref={inputRef}
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
              className="btn btn-primary text-xs px-3 py-1.5 flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}