import React, { useState, useEffect } from 'react';
import { generateScriptWithGemini } from '../services/gemini';
import { Bot, Clock, Edit3, Save, Users, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GeneratorProps {
  initialTopic?: string;
}

const Generator: React.FC<GeneratorProps> = ({ initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic || '');
  const [tone, setTone] = useState('친근하고 유머러스한');
  const [duration, setDuration] = useState('8-10분');
  const [audience, setAudience] = useState('20-30대 일반인');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setScript(''); // Clear previous
    try {
      const generated = await generateScriptWithGemini(topic, tone, duration, audience);
      setScript(generated);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Bot className="text-blue-500" /> 대본 설정
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">영상 주제</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="예: 초보자를 위한 주식 투자법"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-2">
                <Edit3 size={14}/> 톤앤매너
              </label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
              >
                <option>친근하고 유머러스한</option>
                <option>전문적이고 진지한</option>
                <option>에너지가 넘치고 빠른</option>
                <option>감성적이고 차분한</option>
                <option>논란을 일으키는/자극적인</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-2">
                <Clock size={14}/> 목표 길이
              </label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none"
              >
                <option>Shorts (1분 미만)</option>
                <option>3-5분</option>
                <option>8-10분</option>
                <option>15분 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-2">
                <Users size={14}/> 타겟 시청자
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="예: 20대 대학생, 30대 직장인"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {loading ? <Zap className="animate-spin" fill="currentColor"/> : <Zap fill="currentColor"/>}
              {loading ? '작성 중...' : '대본 생성하기'}
            </button>
          </div>
        </div>
      </div>

      {/* Output Area */}
      <div className="w-full lg:w-2/3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <h3 className="font-semibold text-zinc-300">생성된 대본</h3>
          {script && (
            <button 
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              onClick={() => navigator.clipboard.writeText(script)}
            >
              <Save size={14} /> 복사하기
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0d0d10]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
               <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
               <p className="animate-pulse">AI가 창의적인 대본을 쓰고 있습니다...</p>
            </div>
          ) : script ? (
             <div className="prose prose-invert prose-zinc max-w-none">
                <ReactMarkdown>{script}</ReactMarkdown>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
              <Bot size={64} className="mb-4 opacity-20" />
              <p>왼쪽 설정에서 주제를 입력하고 생성 버튼을 눌러주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;