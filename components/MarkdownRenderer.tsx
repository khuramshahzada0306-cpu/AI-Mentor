import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = () => {
    const lines = content.split('\n');
    // FIX: Use React.ReactElement to avoid issues with the global JSX namespace.
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = '';

    const flushCodeBlock = () => {
        if (codeBlockContent.length > 0) {
            elements.push(
                <div key={elements.length} className="bg-slate-800 rounded-md my-4">
                    <div className="text-xs text-slate-400 px-4 py-2 border-b border-slate-700">{codeBlockLang || 'code'}</div>
                    <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                        <code>{codeBlockContent.join('\n')}</code>
                    </pre>
                </div>
            );
            codeBlockContent = [];
            codeBlockLang = '';
        }
    };

    lines.forEach((line, index) => {
      const key = `line-${index}`;

      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (!inCodeBlock) {
            flushCodeBlock();
        } else {
            codeBlockLang = line.substring(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }
      
      if (line.startsWith('### ')) {
        elements.push(<h3 key={key} className="text-xl font-semibold mt-6 mb-2 text-teal-300">{line.substring(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={key} className="text-2xl font-bold mt-8 mb-4 border-b border-slate-700 pb-2 text-teal-400">{line.substring(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={key} className="text-3xl font-bold mt-4 mb-6 text-white">{line.substring(2)}</h1>);
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        elements.push(
          <li key={key} className="ml-6 my-1 list-disc text-slate-300">{line.substring(2)}</li>
        );
      } else if (line.match(/^\d+\.\s/)) {
         elements.push(
          <li key={key} className="ml-6 my-1 list-decimal text-slate-300">{line.replace(/^\d+\.\s/, '')}</li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={key} className="h-4" />);
      } else {
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
                                  .replace(/`(.*?)`/g, '<code class="bg-slate-700 text-teal-300 rounded px-1.5 py-0.5 text-sm">$1</code>');
        elements.push(<p key={key} className="text-slate-300 leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />);
      }
    });

    flushCodeBlock();

    return elements;
  };

  return <div className="prose prose-invert max-w-none">{renderContent()}</div>;
};

export default MarkdownRenderer;
