import React, { useState } from 'react';
import { suggestTopicsWithGemini } from '../services/gemini';
import { TopicSuggestion } from '../types';
import { Lightbulb, Sparkles, Target, Copy } from 'lucide-react';

interface IdeasProps {
  onSelectTopic: (topic: string) => void;
}

const Ideas: React.FC<IdeasProps> = ({ onSelectTopic }) => {
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!context.trim()) return;
    setLoading(true);
    try {
      const data = await suggestTopicsWithGemini(context);
      setSuggestions(data);
    } catch (error) {
      console.error("Suggestion failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-bold text-zinc-100 flex items-center justify-center gap-3">
          <Lightbulb className="text-yellow-500" size={36} />
          아이디어 랩
        </h2>
        <p className="text-zinc-400 text-lg">
          관심 있는 주제나 니치(Niche)를 입력하면,<br/>
          AI가 조회수가 폭발할 만한 주제를 제안해드립니다.
        </p>
      </div>

      <div className="flex gap-2 max-w-xl mx-auto">
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="예: 요리, 재테크, 게임 리뷰, 브이로그..."
          className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white outline-none placeholder-zinc-500 transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
        />
        <button
          onClick={handleSuggest}
          disabled={loading || !context.trim()}
          className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Sparkles className="animate-spin" /> : <Sparkles />}
          {loading ? '생각 중...' : '아이디어 생성'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {suggestions.map((item, index) => (
          <div 
            key={index} 
            className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-900/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full border border-zinc-700">
                  바이럴 점수: {item.viralityScore}/10
                </span>
                <button 
                  onClick={() => onSelectTopic(item.title)}
                  className="text-zinc-500 hover:text-white transition-colors text-xs flex items-center gap-1"
                >
                  <Copy size={12}/> 대본 작성하기
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-100 group-hover:text-yellow-400 transition-colors leading-tight">
                {item.title}
              </h3>
              
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.reasoning}
              </p>
              
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1 flex items-center gap-1">
                  <Target size={12} /> 썸네일 아이디어
                </p>
                <p className="text-sm text-zinc-300 italic">
                  "{item.thumbnailIdea}"
                </p>
              </div>
            </div>
            
            <button
               onClick={() => onSelectTopic(item.title)}
               className="mt-6 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              이 주제로 대본 쓰기
            </button>
          </div>
        ))}
      </div>
      
      {suggestions.length === 0 && !loading && (
        <div className="text-center py-20 opacity-30">
          <Sparkles size={64} className="mx-auto mb-4" />
          <p>아직 생성된 아이디어가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Ideas;