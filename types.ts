export enum AppView {
  ANALYZER = 'analyzer',
  IDEAS = 'ideas',
  GENERATOR = 'generator'
}

export interface AnalysisResult {
  score: number;
  hookAnalysis: string;
  pacing: string;
  audienceRetention: string;
  keywords: string[];
  improvements: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface TopicSuggestion {
  title: string;
  thumbnailIdea: string;
  viralityScore: number;
  reasoning: string;
}

export interface ScriptConfig {
  topic: string;
  tone: string;
  duration: string;
  targetAudience: string;
}

export interface GeneratedScript {
  title: string;
  content: string; // Markdown format
}