import React from 'react';
import { Topic } from '../types';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

interface ContentViewProps {
  topic: Topic | null;
  content: string | null;
  isLoading: boolean;
  error: string | null;
}

const ContentView: React.FC<ContentViewProps> = ({ topic, content, isLoading, error }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-md">
        <h3 className="font-semibold">An Error Occurred</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!topic || !content) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-sm font-medium text-teal-400">{topic.title}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">{topic.subTopic}</h1>
      </div>
      <MarkdownRenderer content={content} />
    </div>
  );
};

export default ContentView;