import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Copy, Check, RotateCcw, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from './services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface FailedRequest {
  content: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const SUGGESTIONS = [
  'What is DevOps?',
  'Explain machine learning',
  'How does the stock market work?',
];

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedRequest, setFailedRequest] = useState<FailedRequest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  const sendRequest = async (content: string, history: FailedRequest['history']) => {
    setError(null);
    setFailedRequest(null);
    setIsLoading(true);

    try {
      const response = await apiService.generate({ idea: content, history });
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: response.content,
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate a response');
      setFailedRequest({ content, history });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const content = input.trim();
    const history = messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendRequest(content, history);
  };

  const handleRetry = async () => {
    if (!failedRequest || isLoading) return;
    await sendRequest(failedRequest.content, failedRequest.history);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const handleNewChat = () => {
    setMessages([]);
    setError(null);
    setFailedRequest(null);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-zinc-900 dark:text-white">Chat Buddy</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">AI-powered assistant</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            New chat
          </button>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-2xl">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-2">
                What's on your mind?
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm text-sm">
                Ask anything — tech, politics, sports, business, or more. Follow up to go deeper.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="px-4 py-2 rounded-full text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                )}

                <div className="max-w-[80%]">
                  <div
                    className={`rounded-2xl px-5 py-3.5 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm font-body">{message.content}</p>
                  </div>

                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(message.id, message.content)}
                      className="flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-lg text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {copiedId === message.id ? (
                        <><Check className="w-3 h-3" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" strokeWidth={2.5} />
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Inline error with retry */}
            {error && !isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                </div>
                <div className="max-w-[80%]">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-sm px-5 py-3.5">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-lg text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 border border-zinc-200 dark:border-zinc-700 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
              className="flex-1 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 text-sm font-body resize-none outline-none leading-6"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 disabled:from-zinc-300 disabled:to-zinc-400 dark:disabled:from-zinc-600 dark:disabled:to-zinc-700 flex items-center justify-center flex-shrink-0 transition-all shadow-sm disabled:shadow-none disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-2">
            Powered by Gemini
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
