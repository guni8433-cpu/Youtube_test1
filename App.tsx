import React, { useState } from 'react';
import { AppView } from './types';
import Analyzer from './components/Analyzer';
import Ideas from './components/Ideas';
import Generator from './components/Generator';
import { LayoutDashboard, PenTool, Lightbulb, Youtube } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.ANALYZER);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentView(AppView.GENERATOR);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(AppView.ANALYZER)}>
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Youtube size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight">TubeGenius <span className="text-red-500">AI</span></span>
          </div>

          <nav className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setCurrentView(AppView.ANALYZER)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                currentView === AppView.ANALYZER 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <LayoutDashboard size={16} /> 대본 분석
            </button>
            <button
              onClick={() => setCurrentView(AppView.IDEAS)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                currentView === AppView.IDEAS 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Lightbulb size={16} /> 주제 추천
            </button>
            <button
              onClick={() => setCurrentView(AppView.GENERATOR)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                currentView === AppView.GENERATOR 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <PenTool size={16} /> 대본 작성
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        {currentView === AppView.ANALYZER && <Analyzer />}
        {currentView === AppView.IDEAS && <Ideas onSelectTopic={handleSelectTopic} />}
        {currentView === AppView.GENERATOR && <Generator initialTopic={selectedTopic} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-zinc-600 text-sm">
        <p>Powered by Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;