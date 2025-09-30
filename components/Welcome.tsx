
import React from 'react';
import { Puzzle, Wand2 } from './Icons';

interface WelcomeProps {
    onFeatureSelect: (viewType: 'code_feedback' | 'project_generator') => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onFeatureSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Welcome to <span className="text-teal-400">IT Mentor</span>
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
          Your AI-powered assistant for mastering Information Technology. Select a topic from the sidebar to start learning, or try one of our smart tools to boost your skills.
        </p>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
                icon={Wand2} 
                title="Code Feedback" 
                description="Get instant, expert feedback on your code to improve quality and learn best practices."
                onClick={() => onFeatureSelect('code_feedback')}
            />
            <FeatureCard 
                icon={Puzzle} 
                title="Project Idea Generator"
                description="Spark your creativity with unique project ideas tailored to your skill level and interests."
                onClick={() => onFeatureSelect('project_generator')}
            />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ComponentType<{className?: string}>, title: string, description: string, onClick: () => void}> = ({ icon: Icon, title, description, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-teal-400 hover:bg-slate-800 transition-all duration-300 text-left flex flex-col items-start"
        >
            <div className="bg-teal-500/10 p-3 rounded-full mb-4">
                <Icon className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm flex-grow">{description}</p>
        </button>
    )
}

export default Welcome;
