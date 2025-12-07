import React, { useState } from 'react';
import { analyzeScriptWithGemini } from '../services/gemini';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, AlertCircle, CheckCircle, TrendingUp, Mic } from 'lucide-react';

const Analyzer: React.FC = () => {
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!script.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeScriptWithGemini(script);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Score', value: result.score },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-zinc-100 flex items-center gap-2">
          <Mic className="text-red-500" />
          대본 분석기
        </h2>
        <p className="text-zinc-400">기존 대본을 붙여넣고 AI의 피드백을 받아보세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full h-96 p-4 bg-zinc-900 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-zinc-200 resize-none placeholder-zinc-600 transition-all"
            placeholder="여기에 대본을 붙여넣으세요..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !script.trim()}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} />}
            {loading ? 'AI 분석 중...' : '대본 분석 시작'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[400px] relative overflow-hidden">
          {!result && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p>대본을 입력하면 분석 결과가 여기에 표시됩니다.</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-zinc-900/80 z-10 backdrop-blur-sm">
              <Loader2 size={48} className="mb-4 animate-spin text-red-500" />
              <p>Gemini가 대본을 읽고 있습니다...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300">종합 점수</h3>
                  <p className="text-sm text-zinc-500">Gemini AI 평가 기준</p>
                </div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-orange-500">
                  {result.score}/100
                </div>
              </div>

              {/* Chart */}
              <div className="h-16 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData}>
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        <Cell fill={result.score > 80 ? '#22c55e' : result.score > 50 ? '#eab308' : '#ef4444'} />
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              {/* Analysis Cards */}
              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <CheckCircle size={16} /> 후킹 (Hook) 분석
                  </h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{result.hookAnalysis}</p>
                </div>

                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <TrendingUp size={16} /> 시청 지속 예상
                  </h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{result.audienceRetention}</p>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 mb-2">발견된 키워드</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div className="border-t border-zinc-800 pt-4">
                  <h4 className="font-semibold text-green-400 mb-3">💡 개선 제안</h4>
                  <ul className="space-y-2">
                    {result.improvements.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="text-zinc-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;