// FIX: Add import for React to resolve 'React' namespace error.
import React from 'react';
import { BrainCircuit, Code, Database, Globe, Layers3, Puzzle, Wand2 } from './components/Icons';
import { Topic } from './types';

export const TOPICS: { title: string, icon: React.ComponentType<{ className?: string }>, subTopics: string[] }[] = [
  {
    title: 'Programming Languages',
    icon: Code,
    subTopics: ['Python', 'JavaScript', 'Java', 'C++']
  },
  {
    title: 'Data Structures & Algorithms',
    icon: BrainCircuit,
    subTopics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Sorting & Searching', 'Dynamic Programming']
  },
  {
    title: 'Database Management',
    icon: Database,
    subTopics: ['SQL Basics', 'Relational Database Design', 'NoSQL Databases', 'Transactions & Concurrency']
  },
  {
    title: 'Networking Concepts',
    icon: Globe,
    subTopics: ['OSI Model', 'TCP/IP Protocol Suite', 'HTTP & DNS', 'Network Security']
  },
  {
    title: 'Software Engineering',
    icon: Layers3,
    subTopics: ['Agile & Scrum', 'Version Control with Git', 'CI/CD Pipelines', 'Software Design Patterns']
  }
];

export const AI_TOOLS: Topic[] = [
    { title: "Code Feedback", icon: Wand2 },
    { title: "Project Idea Generator", icon: Puzzle }
];