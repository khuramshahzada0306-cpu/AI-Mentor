import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Welcome from './components/Welcome';
import ContentView from './components/ContentView';
import CodeFeedback from './components/CodeFeedback';
import ProjectGenerator from './components/ProjectGenerator';
import QuizView from './components/QuizView';
import PastPapersView from './components/PastPapersView';
import { Topic, View } from './types';
import { generateContentForTopic, generateQuiz } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>({ type: 'welcome' });
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTopicSelect = useCallback(async (topic: Topic) => {
    setCurrentView({ type: 'topic', topic });
    setIsLoading(true);
    setError(null);
    setContent(null);
    setSidebarOpen(false);

    try {
      const generatedContent = await generateContentForTopic(topic.title, topic.subTopic);
      setContent(generatedContent);
    } catch (err) {
      setError('Failed to fetch content. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleQuizSelect = useCallback(async (topic: Topic) => {
    setCurrentView({ type: 'quiz', topic });
    setIsLoading(true);
    setError(null);
    setContent(null); // content here is for quiz questions
    setSidebarOpen(false);

    try {
      const quizQuestions = await generateQuiz(topic.subTopic || topic.title);
      setContent(JSON.stringify(quizQuestions));
    } catch (err) {
      setError('Failed to generate quiz. The AI might be busy, please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewChange = (viewType: 'code_feedback' | 'project_generator' | 'welcome' | 'past_papers') => {
    setCurrentView({ type: viewType });
    setContent(null);
    setError(null);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (currentView.type) {
      case 'welcome':
        return <Welcome onFeatureSelect={handleViewChange} />;
      case 'topic':
        return <ContentView topic={currentView.topic} content={content} isLoading={isLoading} error={error} />;
      case 'quiz':
        return <QuizView topic={currentView.topic} questionsJson={content} isLoading={isLoading} error={error} onRetry={() => handleQuizSelect(currentView.topic)} />;
      case 'code_feedback':
        return <CodeFeedback />;
      case 'project_generator':
        return <ProjectGenerator />;
      case 'past_papers':
        return <PastPapersView />;
      default:
        return <Welcome onFeatureSelect={handleViewChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200 font-sans">
      <Sidebar 
        onTopicSelect={handleTopicSelect} 
        onQuizSelect={handleQuizSelect}
        onFeatureSelect={handleViewChange} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onTopicSelect={handleTopicSelect} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;