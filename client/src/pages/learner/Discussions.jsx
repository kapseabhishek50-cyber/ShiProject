import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Pin,
  Send,
  Sparkles,
  Bot,
  Brain,
  Terminal,
  BarChart2,
  FileText,
  Map,
  Shield,
  CornerDownRight,
} from 'lucide-react';
import { Card, Loading, ErrorNote, Empty } from '../../components/ui.jsx';
import { useApi, useMutation } from '../../hooks/useApi.js';
import { api, endpoints, formatDate } from '../../lib/index.js';

const GROUP_ICONS = {
  Brain: Brain,
  Terminal: Terminal,
  BarChart2: BarChart2,
  FileText: FileText,
  Map: Map,
  Shield: Shield,
};

export default function Discussions() {
  const groupsApi = useApi(endpoints.discussionGroups);
  const groups = groupsApi.data?.groups ?? [];

  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newText, setNewText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const messagesEndRef = useRef(null);

  // Default to first group
  useEffect(() => {
    if (groups.length > 0 && !activeGroup) {
      setActiveGroup(groups[0]);
    }
  }, [groups, activeGroup]);

  // Load messages for selected group
  useEffect(() => {
    if (!activeGroup?._id) return;
    let cancelled = false;

    async function load() {
      setLoadingMessages(true);
      try {
        const res = await api.get(`/discussions/groups/${activeGroup._id}/messages`);
        if (!cancelled) setMessages(res.messages || []);
      } catch (err) {
        console.error('Failed to load group messages', err);
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newText.trim() || !activeGroup) return;

    const payload = {
      content: newText.trim(),
      replyTo: replyTo?._id,
    };
    setNewText('');
    setReplyTo(null);

    try {
      const res = await api.post(`/discussions/groups/${activeGroup._id}/messages`, payload);
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error('Failed to post message', err);
    }
  };

  const handleAskAi = async () => {
    if (!aiPrompt.trim() || !activeGroup || aiLoading) return;
    setAiLoading(true);
    try {
      const res = await api.post(`/discussions/groups/${activeGroup._id}/ask-ai`, { prompt: aiPrompt.trim() });
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
        setAiPrompt('');
        setShowAiModal(false);
      }
    } catch (err) {
      console.error('AI co-pilot error', err);
    } finally {
      setAiLoading(false);
    }
  };

  if (groupsApi.loading) return <Loading label="Loading statistical discussion groups" />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-ink">Statistical Learning Discussions</h1>
        <p className="mt-1 text-sm text-ink-2">
          Collaborative peer capacity building across official statistical domains. Meaningful discussion contributions award +20 XP towards your streak.
        </p>
      </div>

      <ErrorNote error={groupsApi.error} />

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Groups Sidebar */}
        <div className="space-y-2 lg:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted px-1">Learning Groups</h3>
          <div className="space-y-1.5">
            {groups.map((group) => {
              const Icon = GROUP_ICONS[group.icon] || MessageSquare;
              const isActive = activeGroup?._id === group._id;
              return (
                <button
                  key={group._id}
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'border-accent bg-accent/5 shadow-sm'
                      : 'border-hairline bg-surface hover:bg-surface-2'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive ? 'bg-accent text-white' : 'bg-surface-2 text-ink-2'
                    }`}
                    style={isActive ? { background: 'var(--accent, #1d4ed8)' } : {}}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-semibold text-ink truncate">{group.title}</h4>
                      <span className="flex items-center gap-1 text-[11px] text-ink-muted shrink-0">
                        <Users size={12} /> {group.memberCount || 30}
                      </span>
                    </div>
                    <p className="text-xs text-ink-2 truncate mt-0.5">{group.topic}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="flex flex-col h-[650px] rounded-2xl border border-hairline bg-surface shadow-sm lg:col-span-8 overflow-hidden">
          {/* Group Header */}
          {activeGroup && (
            <div className="flex items-center justify-between border-b border-hairline bg-surface px-5 py-3.5">
              <div>
                <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <span>{activeGroup.title}</span>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-normal uppercase text-ink-muted">
                    {activeGroup.category}
                  </span>
                </h3>
                <p className="text-xs text-ink-2 mt-0.5 line-clamp-1">{activeGroup.topic}</p>
              </div>

              {/* Ask AI Trigger */}
              <button
                type="button"
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-1.5 rounded-full border border-hairline bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-white transition-all"
              >
                <Sparkles size={14} />
                <span>Ask AI Co-pilot</span>
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {loadingMessages ? (
              <Loading label="Loading discussion messages" />
            ) : messages.length === 0 ? (
              <Empty>No messages in this group yet. Start the discussion!</Empty>
            ) : (
              messages.map((m) => (
                <div
                  key={m._id}
                  className={`rounded-xl border p-4 transition-all ${
                    m.isPinned
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : m.isAiGenerated
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-hairline bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          m.isAiGenerated
                            ? 'bg-accent text-white'
                            : m.authorRole === 'trainer'
                            ? 'bg-amber-500 text-white'
                            : 'bg-surface-2 text-ink'
                        }`}
                        style={m.isAiGenerated ? { background: 'var(--accent, #1d4ed8)' } : {}}
                      >
                        {m.isAiGenerated ? <Bot size={14} /> : m.authorName[0]}
                      </div>
                      <span className="text-xs font-semibold text-ink">{m.authorName}</span>
                      {m.isAiGenerated ? (
                        <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                          AI Co-pilot
                        </span>
                      ) : m.authorRole === 'trainer' ? (
                        <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                          NSSTA Trainer
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                      {m.isPinned && (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <Pin size={12} /> Pinned
                        </span>
                      )}
                      <span>{formatDate(m.createdAt)}</span>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-ink leading-relaxed whitespace-pre-wrap">{m.content}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-hairline/50 pt-2 text-[11px] text-ink-muted">
                    <button
                      type="button"
                      onClick={() => setReplyTo(m)}
                      className="hover:text-ink transition-colors flex items-center gap-1"
                    >
                      <CornerDownRight size={12} /> Reply
                    </button>
                    {m.helpfulCount > 0 && <span>👍 {m.helpfulCount} helpful</span>}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Context Banner */}
          {replyTo && (
            <div className="flex items-center justify-between border-t border-hairline bg-surface-2 px-4 py-2 text-xs">
              <span className="truncate text-ink-2">
                Replying to <strong className="text-ink">{replyTo.authorName}</strong>: &quot;{replyTo.content.slice(0, 40)}...&quot;
              </span>
              <button type="button" onClick={() => setReplyTo(null)} className="text-ink-muted hover:text-ink">
                ✕
              </button>
            </div>
          )}

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="border-t border-hairline bg-surface p-3 flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={`Contribute to ${activeGroup?.title || 'discussion'}... (+20 XP)`}
              className="field text-xs flex-1"
            />
            <button
              type="submit"
              disabled={!newText.trim()}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Send size={14} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Ask AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-hairline bg-surface p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                Ask AI Co-pilot ({activeGroup?.title})
              </h3>
              <button type="button" onClick={() => setShowAiModal(false)} className="text-ink-muted hover:text-ink">
                ✕
              </button>
            </div>
            <p className="text-xs text-ink-2">
              StatSkill AI will analyze official MoSPI guidelines and post a contextually validated response directly into the discussion.
            </p>
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Explain how to handle outlier weights in CPI revisions under NQAF guidelines..."
              className="field text-xs w-full"
              disabled={aiLoading}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-ink-2 hover:bg-surface-2"
                disabled={aiLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAskAi}
                disabled={!aiPrompt.trim() || aiLoading}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>{aiLoading ? 'Generating AI explanation...' : 'Post AI Response'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

