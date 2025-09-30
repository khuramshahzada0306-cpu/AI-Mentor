
import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, ExternalLink, Spinner } from './Icons';
import { pastPapersData } from '../data/pastPapersData';
import { PastPaper } from '../types';

declare const jspdf: any;

const papersList = [
  { year: '2024', group: 'Group I', code: '8195', fileName: 'math_2024_g1.pdf' },
  { year: '2024', group: 'Group II', code: '8192', fileName: 'math_2024_g2.pdf' },
  { year: '2023', group: 'Group I', code: '8191', fileName: 'math_2023_g1.pdf' },
  { year: '2023', group: 'Group II', code: '8194', fileName: 'math_2023_g2.pdf' },
  { year: '2022', group: 'Group I', code: '8193', fileName: 'math_2022_g1.pdf' },
  { year: '2022', group: 'Group II', code: '8192', fileName: 'math_2022_g2.pdf' },
  { year: '2021', group: 'Group I', code: '8195', fileName: 'math_2021_g1.pdf' },
  { year: '2021', group: 'Group II', code: '8198', fileName: 'math_2021_g2.pdf' },
  { year: '2019', group: 'Group I', code: '8195', fileName: 'math_2019_g1.pdf' },
  { year: '2019', group: 'Group II', code: '8198', fileName: 'math_2019_g2.pdf' },
  { year: '2018', group: 'Group I', code: '8197', fileName: 'math_2018_g1.pdf' },
  { year: '2018', group: 'Group II', code: '8198', fileName: 'math_2018_g2.pdf' },
];

const fullPastPapers: PastPaper[] = papersList.map(p => ({
    ...p,
    content: pastPapersData[p.fileName] || "Content for this paper is not available."
}));

const PastPapersView: React.FC = () => {
  const [seenPapers, setSeenPapers] = useState<Set<string>>(new Set());
  const [processingState, setProcessingState] = useState<{ fileName: string | null; action: 'open' | 'download' | null }>({ fileName: null, action: null });

  useEffect(() => {
    try {
        const storedSeenPapers = localStorage.getItem('seenPapers');
        if (storedSeenPapers) {
            setSeenPapers(new Set(JSON.parse(storedSeenPapers)));
        }
    } catch (error) {
        console.error("Failed to parse seen papers from localStorage", error);
        setSeenPapers(new Set());
    }
  }, []);

  const handleInteraction = (fileName: string) => {
    const newSeenPapers = new Set(seenPapers);
    newSeenPapers.add(fileName);
    setSeenPapers(newSeenPapers);
    localStorage.setItem('seenPapers', JSON.stringify(Array.from(newSeenPapers)));
  };

  const generatePdf = (paper: PastPaper) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    // --- Configuration ---
    const MARGIN = 40;
    const FONT_SIZES = {
      title: 18,
      heading: 14,
      subheading: 11,
      body: 10,
    };
    const LINE_HEIGHT_RATIO = 1.35;
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
    let cursorY = MARGIN;

    // --- Helper Functions ---
    const checkAndAddPage = (spaceNeeded: number) => {
      if (cursorY + spaceNeeded > PAGE_HEIGHT - MARGIN) {
        doc.addPage();
        cursorY = MARGIN;
      }
    };
    
    const renderWrappedText = (text: string, options: { 
        fontStyle?: 'normal' | 'bold' | 'italic', 
        fontSize?: number, 
        spaceBefore?: number, 
        spaceAfter?: number, 
        align?: 'left' | 'center' | 'right' 
    }) => {
      const { 
        fontStyle = 'normal', 
        fontSize = FONT_SIZES.body, 
        spaceBefore = 0, 
        spaceAfter = 0, 
        align = 'left',
      } = options;
      
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
      const textHeight = lines.length * fontSize * LINE_HEIGHT_RATIO;
      
      checkAndAddPage(textHeight + spaceBefore + spaceAfter);
      cursorY += spaceBefore;

      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(fontSize);
      
      let xPos = MARGIN;
      if (align === 'center') xPos = PAGE_WIDTH / 2;
      else if (align === 'right') xPos = PAGE_WIDTH - MARGIN;

      doc.text(lines, xPos, cursorY, { align });
      cursorY += textHeight;
      
      cursorY += spaceAfter;
    };
    
    // --- Document Generation ---
    const title = `Mathematics Past Paper - ${paper.year} (${paper.group})`;
    renderWrappedText(title, { fontSize: FONT_SIZES.title, fontStyle: 'bold', align: 'center', spaceAfter: 15 });
    renderWrappedText(`Paper Code: ${paper.code}`, { fontSize: FONT_SIZES.subheading, align: 'center', spaceAfter: 20 });
    
    const lines = paper.content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        // Add a small gap for blank lines to preserve structure
        checkAndAddPage(FONT_SIZES.body * 0.5);
        cursorY += FONT_SIZES.body * 0.5;
        continue;
      }
      
      // Heuristics for different line types
      if (trimmedLine.match(/^(SECTION|GROUP|Q\.PAPER|PAPER - II)/)) {
        renderWrappedText(trimmedLine, { fontSize: FONT_SIZES.heading, fontStyle: 'bold', align: 'center', spaceBefore: 15, spaceAfter: 10 });
      } else if (trimmedLine.match(/^(Note:|Time Allowed:|Maximum Marks:|Write short answers)/)) {
         renderWrappedText(trimmedLine, { fontSize: FONT_SIZES.subheading, fontStyle: 'bold', spaceBefore: 10, spaceAfter: 5 });
      } else if (trimmedLine.match(/^(\d+-\d+|\d+\.|\(\w+\))/)) {
         renderWrappedText(trimmedLine, { fontStyle: 'bold', spaceBefore: 8, spaceAfter: 4 });
      } else {
        renderWrappedText(trimmedLine, {});
      }
    }
    
    return doc;
  };
  
  const handleDownload = (paper: PastPaper) => {
    setProcessingState({ fileName: paper.fileName, action: 'download' });
    setTimeout(() => {
        try {
            const doc = generatePdf(paper);
            doc.save(paper.fileName);
            handleInteraction(paper.fileName);
        } catch (e) {
            console.error("Failed to generate PDF for download:", e);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setProcessingState({ fileName: null, action: null });
        }
    }, 50); // Small delay to allow UI to update and show spinner
  };

  const handleOpen = (paper: PastPaper) => {
    setProcessingState({ fileName: paper.fileName, action: 'open' });
    setTimeout(() => {
        try {
            const doc = generatePdf(paper);
            doc.output('dataurlnewwindow');
            handleInteraction(paper.fileName);
        } catch (e) {
            console.error("Failed to generate PDF for viewing:", e);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setProcessingState({ fileName: null, action: null });
        }
    }, 50); // Small delay to allow UI to update and show spinner
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-teal-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">12th Class Math Past Papers</h1>
      </div>
      <p className="text-slate-400 mb-8">
        Here is a collection of past examination papers to help you prepare. You can view the content directly as a PDF or download it.
      </p>
      <div className="space-y-4">
        {fullPastPapers.map((paper, index) => {
          const isProcessingOpen = processingState.fileName === paper.fileName && processingState.action === 'open';
          const isProcessingDownload = processingState.fileName === paper.fileName && processingState.action === 'download';
          const isProcessing = isProcessingOpen || isProcessingDownload;

          return (
          <div 
            key={index} 
            className={`bg-slate-800/50 p-4 rounded-lg border ${seenPapers.has(paper.fileName) ? 'border-teal-500/30' : 'border-slate-700'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-700 p-3 rounded-md hidden sm:block flex-shrink-0">
                 <FileText className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">Mathematics Past Paper - {paper.year}</h3>
                    {seenPapers.has(paper.fileName) && (
                        <span className="flex items-center gap-1 text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Viewed
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-400">{paper.group} | Paper Code: {paper.code}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <button
                  onClick={() => handleOpen(paper)}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium py-2 px-3 rounded-md transition-colors disabled:bg-slate-600 disabled:cursor-wait min-w-[80px]"
                >
                  {isProcessingOpen ? (
                      <Spinner className="w-5 h-5" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Open</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownload(paper)}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-3 rounded-md transition-colors disabled:bg-teal-800 disabled:cursor-wait min-w-[120px]"
                >
                  {isProcessingDownload ? (
                      <Spinner className="w-5 h-5" />
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </>
                  )}
                </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default PastPapersView;