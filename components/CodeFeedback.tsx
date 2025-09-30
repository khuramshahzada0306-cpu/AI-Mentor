import React, { useState } from 'react';
import { getCodeFeedback } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import { Wand2 } from './Icons';

const CodeFeedback: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to get feedback.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const result = await getCodeFeedback(code, language);
      setFeedback(result);
    } catch (err) {
      setError('Failed to get feedback. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
            <Wand2 className="w-8 h-8 text-teal-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Code Feedback</h1>
        </div>
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <label className="block col-span-1 md:col-span-3">
            <span className="text-slate-300 font-medium">Programming Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-white"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c++">C++</option>
              <option value="sql">SQL</option>
            </select>
          </label>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your ${language} code here...`}
          className="w-full h-64 p-4 font-mono text-sm bg-slate-900 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Get Feedback'}
        </button>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </div>

      {isLoading && (
         <div className="mt-8">
            <LoadingSpinner />
         </div>
      )}

      {feedback && (
        <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Feedback Analysis</h2>
          <MarkdownRenderer content={feedback} />
        </div>
      )}
    </div>
  );
};

export default CodeFeedback;