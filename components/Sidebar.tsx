
import React, { useState } from 'react';
import { Topic } from '../types';
import { TOPICS, AI_TOOLS } from '../constants';
import { BookOpen, GraduationCap, Puzzle, Wand2, X, FileText } from './Icons';

interface SidebarProps {
  onTopicSelect: (topic: Topic) => void;
  onQuizSelect: (topic: Topic) => void;
  onFeatureSelect: (viewType: 'code_feedback' | 'project_generator' | 'welcome' | 'past_papers') => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTopicSelect, onQuizSelect, onFeatureSelect, isOpen, setIsOpen }) => {
  const [openTopic, setOpenTopic] = useState<string | null>(TOPICS[0].title);

  const handleFeatureClick = (title: string) => {
    if (title === "Code Feedback") {
      onFeatureSelect('code_feedback');
    } else if (title === "Project Idea Generator") {
      onFeatureSelect('project_generator');
    } else if (title === "Past Papers") {
      onFeatureSelect('past_papers');
    }
  };

  const NavItem: React.FC<{ topic: Topic, isSubTopic?: boolean, onClick: () => void }> = ({ topic, isSubTopic = false, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 rounded-md transition-colors duration-200 ${isSubTopic ? 'pl-10 pr-2 py-2 text-sm' : 'px-4 py-2.5 font-medium'} text-slate-300 hover:bg-teal-500/10 hover:text-teal-300`}
    >
      {topic.icon && !isSubTopic && <topic.icon className="w-5 h-5 flex-shrink-0" />}
      <span>{isSubTopic ? topic.subTopic : topic.title}</span>
    </button>
  );

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed lg:static top-0 left-0 h-full bg-slate-900 border-r border-slate-800 w-72 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2" onClick={() => onFeatureSelect('welcome')}>
            <GraduationCap className="w-7 h-7 text-teal-400 cursor-pointer" />
            <span className="text-xl font-bold text-white tracking-tight cursor-pointer">IT Mentor</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Study Topics</h3>
            <div className="space-y-1">
              {TOPICS.map(topic => (
                <div key={topic.title}>
                  <button
                    onClick={() => setOpenTopic(openTopic === topic.title ? null : topic.title)}
                    className="w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 font-medium rounded-md text-slate-300 hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <topic.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{topic.title}</span>
                    </div>
                     <svg className={`w-4 h-4 transition-transform ${openTopic === topic.title ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  {openTopic === topic.title && (
                    <div className="pt-1 pl-4 border-l border-slate-700 ml-6 mt-1">
                      {topic.subTopics.map(subTopic => (
                        <div key={subTopic} className="group flex items-center justify-between rounded-md hover:bg-teal-500/10">
                            <button onClick={() => onTopicSelect({ title: topic.title, subTopic })} className="flex-grow text-left pl-4 pr-2 py-2 text-sm text-slate-400 group-hover:text-teal-300">
                                {subTopic}
                            </button>
                             <button onClick={() => onQuizSelect({ title: topic.title, subTopic })} title={`Quiz on ${subTopic}`} className="p-2 text-slate-500 hover:text-teal-400">
                                <BookOpen className="w-4 h-4" />
                            </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Tools</h3>
            <div className="space-y-1">
              {AI_TOOLS.map(tool => (
                <NavItem key={tool.title} topic={tool} onClick={() => handleFeatureClick(tool.title)} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resources</h3>
            <div className="space-y-1">
                <NavItem 
                    topic={{ title: "Past Papers", icon: FileText }} 
                    onClick={() => handleFeatureClick("Past Papers")} 
                />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;