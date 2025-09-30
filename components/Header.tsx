
import React, { useState, useEffect, useRef } from 'react';
import { Menu, GraduationCap, Search } from './Icons';
import { Topic } from '../types';
import { TOPICS } from '../constants';

interface HeaderProps {
  onMenuClick: () => void;
  onTopicSelect: (topic: Topic) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onTopicSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Topic[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchResults: Topic[] = [];
    const lowerCaseQuery = query.toLowerCase();

    TOPICS.forEach(topic => {
      topic.subTopics.forEach(subTopic => {
        if (subTopic.toLowerCase().includes(lowerCaseQuery) || topic.title.toLowerCase().includes(lowerCaseQuery)) {
          searchResults.push({ title: topic.title, subTopic, icon: topic.icon });
        }
      });
    });
    
    const uniqueResults = searchResults.filter((v,i,a)=>a.findIndex(t=>(t.subTopic === v.subTopic))===i);
    setResults(uniqueResults.slice(0, 7));
  }, [query]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (topic: Topic) => {
    onTopicSelect(topic);
    setQuery('');
    setResults([]);
  };

  return (
    <header className="flex-shrink-0 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between p-4 gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-teal-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">IT Mentor</h1>
        </div>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div ref={searchRef} className="relative w-full max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for topics..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            />
          </div>
          {results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50 overflow-hidden">
              <ul>
                {results.map((result, index) => (
                  <li key={`${result.subTopic}-${index}`}>
                    <button
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-4 py-3 hover:bg-teal-500/10 flex items-center gap-3 transition-colors"
                    >
                      {result.icon && <result.icon className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                      <div className="flex-grow overflow-hidden">
                          <span className="text-white truncate">{result.subTopic}</span>
                          <p className="text-xs text-slate-400 truncate">{result.title}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
       <div className="hidden sm:block text-sm text-slate-400 w-48 text-right flex-shrink-0">
        AI-Powered Study Assistant
      </div>
    </header>
  );
};

export default Header;
