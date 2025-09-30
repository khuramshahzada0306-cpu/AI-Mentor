// FIX: Add import for React to resolve 'React' namespace error.
import React from 'react';

export interface Topic {
  title: string;
  subTopic?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface PastPaper {
  year: string;
  group: string;
  code: string;
  fileName: string;
  content: string;
}

export type ViewType = 'welcome' | 'topic' | 'quiz' | 'code_feedback' | 'project_generator' | 'past_papers';

export interface View {
    type: ViewType;
    topic?: Topic;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}