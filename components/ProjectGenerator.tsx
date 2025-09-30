import React, { useState } from 'react';
import { generateProjectIdea } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import { Puzzle } from './Icons';

const ProjectGenerator: React.FC = () => {
  const [skillLevel, setSkillLevel] = useState<string>('Beginner');
  const [interests, setInterests] = useState<string>('');
  const [projectIdea, setProjectIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!interests.trim()) {
      setError('Please enter your interests.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setProjectIdea(null);
    try {
      const result = await generateProjectIdea(skillLevel, interests);
      setProjectIdea(result);
    } catch (err) {
      setError('Failed to generate a project idea. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Puzzle className="w-8 h-8 text-teal-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Project Idea Generator</h1>
      </div>
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-slate-300 font-medium">Skill Level</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-white"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 font-medium">Interests</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Web Development, Machine Learning, Gaming"
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-white"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate Project Idea'}
        </button>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </div>

      {isLoading && (
        <div className="mt-8">
            <LoadingSpinner />
        </div>
      )}

      {projectIdea && (
        <div className="mt-8 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Your Custom Project Idea</h2>
          <MarkdownRenderer content={projectIdea} />
        </div>
      )}
    </div>
  );
};

export default ProjectGenerator;