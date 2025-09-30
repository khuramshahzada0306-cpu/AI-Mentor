import React, { useState, useEffect, useMemo } from 'react';
import { Topic, QuizQuestion } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { BookOpen } from './Icons';

interface QuizViewProps {
  topic: Topic;
  questionsJson: string | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ topic, questionsJson, isLoading, error, onRetry }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (questionsJson) {
      try {
        const parsedQuestions = JSON.parse(questionsJson);
        setQuestions(parsedQuestions);
        setSelectedAnswers(new Array(parsedQuestions.length).fill(null));
        setCurrentQuestionIndex(0);
        setShowResults(false);
      } catch (e) {
        console.error("Failed to parse quiz questions JSON:", e);
      }
    }
  }, [questionsJson]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = useMemo(() => {
    return selectedAnswers.reduce((total, answer, index) => {
        if (questions[index] && answer === questions[index].correctAnswer) {
            return total + 1;
        }
        return total;
    }, 0);
  }, [selectedAnswers, questions]);

  const resetQuiz = () => {
    onRetry();
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !questions || questions.length === 0) {
    return (
      <div className="text-center text-red-400 bg-red-500/10 p-6 rounded-lg max-w-2xl mx-auto">
        <h3 className="font-semibold text-xl">Quiz Generation Failed</h3>
        <p className="my-2">{error || "The AI couldn't generate a quiz for this topic."}</p>
        <button
            onClick={onRetry}
            className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Quiz Results</h1>
        <p className="text-lg text-slate-300 mb-6">Topic: {topic.subTopic}</p>
        <div className={`text-5xl sm:text-6xl font-extrabold mb-4 ${score / questions.length > 0.7 ? 'text-green-400' : 'text-yellow-400'}`}>
            {score} / {questions.length}
        </div>
        <p className="text-xl sm:text-2xl font-semibold text-white mb-8">
            You scored {((score / questions.length) * 100).toFixed(0)}%
        </p>

        <div className="space-y-4 text-left">
            {questions.map((q, index) => (
                <div key={index} className={`p-4 rounded-lg border ${selectedAnswers[index] === q.correctAnswer ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <p className="font-semibold text-white">{index + 1}. {q.question}</p>
                    <p className="text-sm mt-2">Your answer: <span className="font-medium">{selectedAnswers[index] || "Not answered"}</span></p>
                    <p className="text-sm">Correct answer: <span className="font-medium">{q.correctAnswer}</span></p>
                    <p className="text-xs text-slate-400 mt-2">{q.explanation}</p>
                </div>
            ))}
        </div>

        <button
          onClick={resetQuiz}
          className="mt-8 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-md transition-colors text-lg"
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-teal-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Quiz: {topic.subTopic}</h1>
      </div>
      <p className="text-slate-400 mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>

      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`block w-full text-left p-4 rounded-md border-2 transition-all duration-200 ${
                selectedAnswers[currentQuestionIndex] === option
                  ? 'bg-teal-500/20 border-teal-400 text-white'
                  : 'bg-slate-700 border-slate-600 hover:border-slate-500 text-slate-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="mt-8 w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;