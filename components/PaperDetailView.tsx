import React from 'react';
import { PastPaper } from '../types';
import { ArrowLeft, FileText } from './Icons';

interface PaperDetailViewProps {
  paper: PastPaper;
  onBack: () => void;
}

const PaperDetailView: React.FC<PaperDetailViewProps> = ({ paper, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-teal-300 transition-colors mb-6 font-medium">
        <ArrowLeft className="w-5 h-5" />
        Back to Past Papers List
      </button>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-teal-400" />
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Math Paper - {paper.year} ({paper.group})
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1">Paper Code: {paper.code}</p>
        </div>
      </div>
      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg border border-slate-700">
        <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
          {paper.content}
        </pre>
      </div>
    </div>
  );
};

export default PaperDetailView;