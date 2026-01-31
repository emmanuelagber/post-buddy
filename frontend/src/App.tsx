import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, AlertCircle } from 'lucide-react';
import { PostCard } from './components/PostCard';
import { apiService, GenerateResponse } from './services/api';

function App() {
  const [idea, setIdea] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  // Load available topics on mount
  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const response = await apiService.getTopics();
      setTopics(response.topics);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError('Please enter an idea');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiService.generatePosts({
        idea: idea.trim(),
        topic: selectedTopic || undefined,
      });

      setResult(response);
    } catch (error: any) {
      setError(error.message || 'Failed to generate posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white">
                  Post Buddy
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-body">
                  AI-powered social media content generator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Input section */}
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8">
              <label className="block mb-4">
                <span className="text-lg font-display font-semibold text-zinc-900 dark:text-white mb-2 block">
                  What's on your mind?
                </span>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Share your idea... (Cmd+Enter to generate)"
                  className="w-full px-5 py-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 resize-none font-body text-base"
                  rows={4}
                />
              </label>

              <div className="flex items-center gap-4 mb-6">
                <label className="flex-1">
                  <span className="text-sm font-display font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                    Topic (optional - will auto-detect)
                  </span>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 font-body"
                  >
                    <option value="">Auto-detect topic</option>
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic.charAt(0).toUpperCase() + topic.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !idea.trim()}
                className="w-full bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 disabled:from-zinc-300 disabled:to-zinc-400 dark:disabled:from-zinc-700 dark:disabled:to-zinc-600 text-white font-display font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-3 text-lg disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating magic...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Posts
                  </>
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200 font-body">{error}</p>
                </div>
              )}

              {result && result.topicConfidence !== undefined && (
                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
                  <p className="text-sm text-primary-900 dark:text-primary-100 font-body">
                    <span className="font-semibold">Detected topic:</span> {result.topic} ({result.topicConfidence}% confidence)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Results section */}
          {(result || isLoading) && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-6 text-center">
                Generated Posts
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PostCard
                  platform="x"
                  content={result?.posts.x || null}
                  isLoading={isLoading}
                />
                <PostCard
                  platform="linkedin"
                  content={result?.posts.linkedin || null}
                  isLoading={isLoading}
                />
                <PostCard
                  platform="facebook"
                  content={result?.posts.facebook || null}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 font-body">
              Built with AI • Powered by Gemini • Open for extension
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
