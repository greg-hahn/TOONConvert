import React, { useState, useRef, useMemo } from 'react';
import { TokenCounts } from '../types';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  label: string;
  placeholder?: string;
  language?: string;
  tokenCounts?: TokenCounts;
  error?: string | null;
}

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const highlightSyntax = (code: string, language?: string) => {
  if (!code) return '';

  // Canonical TOON Code Highlighting
  if (language === 'TOON CODE' || language === 'TOON') {
    return code.replace(
      /(^[\s]*[\w-]+\[\d+\]\{[^}]+\}:)|(^[\s-]*[\w-]+:)|(".*?")|(\b-?\d+(?:\.\d+)?\b)|(\b(?:true|false|null)\b)|(,)/gm,
      (match, arrayHeader, key, string, number, boolean, comma) => {
        if (arrayHeader) {
          const safeMatch = escapeHtml(match);
          // Make the array count [n] visually distinct
          const prominentCount = safeMatch.replace(/\[(\d+)\]/, (fullGroup, count) => {
            return `<span class="text-indigo-400 font-normal">[</span><span class="bg-indigo-500 text-white font-bold rounded-[2px] ring-1 ring-indigo-500/50 shadow-sm" title="Array count: ${count}">${count}</span><span class="text-indigo-400 font-normal">]</span>`;
          });
          return `<span class="text-purple-400 font-bold">${prominentCount}</span>`;
        }
        if (key) return `<span class="text-blue-400 font-semibold">${escapeHtml(match)}</span>`;
        if (string) return `<span class="text-yellow-300">${escapeHtml(match)}</span>`;
        if (number) return `<span class="text-orange-400">${escapeHtml(match)}</span>`;
        if (boolean) return `<span class="text-pink-400">${escapeHtml(match)}</span>`;
        if (comma) return `<span class="text-slate-500 font-bold">,</span>`;
        return escapeHtml(match);
      }
    );
  }

  // CSV Highlighting
  if (language === 'CSV') {
    return code.replace(/((?:\s*"(?:[^"]|"")*")|[^,\n\r]+|[,])/g, (match) => {
      if (match === ',') return `<span class="text-orange-500 font-bold">,</span>`;
      
      const trimmed = match.trim();
      
      // Quoted string (green)
      if (trimmed.startsWith('"')) return `<span class="text-green-400">${escapeHtml(match)}</span>`;
      
      // Numbers (blue)
      if (/^-?\d+(\.\d+)?$/.test(trimmed)) return `<span class="text-blue-400">${escapeHtml(match)}</span>`;
      
      // Booleans / Null (pink/purple)
      if (/^(true|false|null)$/i.test(trimmed)) return `<span class="text-purple-400 font-semibold">${escapeHtml(match)}</span>`;
      
      return escapeHtml(match);
    });
  }

  // Basic JSON Highlighting
  if (language === 'JSON') {
    return code.replace(/(".*?"|:|\b\d+\b|\b(?:true|false|null)\b)/g, (match) => {
      if (match.startsWith('"')) {
        return `<span class="text-green-400">${escapeHtml(match)}</span>`;
      }
      if (match === ':') return `<span class="text-slate-500">${match}</span>`;
      if (/^\d/.test(match)) return `<span class="text-orange-300">${match}</span>`;
      if (/true|false|null/.test(match)) return `<span class="text-purple-400 font-semibold">${match}</span>`;
      return escapeHtml(match);
    });
  }

  return escapeHtml(code);
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  label,
  placeholder,
  language,
  tokenCounts,
  error
}) => {
  const [copied, setCopied] = useState(false);
  const [showRegexInfo, setShowRegexInfo] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleDownload = () => {
    if (!value) return;

    let extension = 'txt';
    let mimeType = 'text/plain';

    if (language) {
      const lang = language.toUpperCase();
      if (lang.includes('JSON')) {
        extension = 'json';
        mimeType = 'application/json';
      } else if (lang.includes('CSV')) {
        extension = 'csv';
        mimeType = 'text/csv';
      } else if (lang.includes('TOON')) {
        extension = 'toon';
      }
    }

    const blob = new Blob([value], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `toon_content.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const highlightedCode = useMemo(() => highlightSyntax(value, language), [value, language]);

  const containerClass = `flex flex-col h-full bg-slate-800 rounded-xl border overflow-hidden shadow-lg transition-all duration-300 ${
    error 
      ? 'border-red-500/50 ring-1 ring-red-500/50' 
      : 'border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent'
  }`;

  return (
    <div className={containerClass}>
      <style>{`
        .transparent-scrollbar::-webkit-scrollbar {
          background: transparent;
          width: 8px;
          height: 8px;
        }
        .transparent-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }
      `}</style>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center space-x-2">
           <label htmlFor={`editor-${label.replace(/\s+/g, '-')}`} className="text-xs font-bold tracking-wider text-slate-400 uppercase cursor-pointer">{label}</label>
           {language && <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-900 text-indigo-300 border border-indigo-700">{language}</span>}
           
           {(language === 'TOON CODE' || language === 'TOON') && (
             <button
               onClick={() => setShowRegexInfo(true)}
               className="ml-1 p-1 text-slate-500 hover:text-indigo-400 transition-colors rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               title="View Regex Patterns"
               aria-label="View Regex Patterns"
             >
               <InfoIcon />
             </button>
           )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            disabled={!value}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Download File"
            aria-label="Download content as file"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!value}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Copy to Clipboard"
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2 animate-pulse" role="alert">
          <div className="text-red-400">
             <AlertIcon />
          </div>
          <span className="text-xs text-red-200 font-mono">{error}</span>
        </div>
      )}
      
      <div className="relative flex-1 min-h-0">
        {/* Highlighted Layer */}
        <pre
          ref={preRef}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm pointer-events-none whitespace-pre-wrap break-words overflow-auto transparent-scrollbar text-slate-300"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightedCode + '<br/>' }}
          style={{ fontFamily: "'Fira Code', monospace" }}
        />

        {/* Input/Scroll Layer */}
        <textarea
          id={`editor-${label.replace(/\s+/g, '-')}`}
          ref={textareaRef}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent text-transparent caret-white resize-none focus:outline-none z-10 whitespace-pre-wrap break-words overflow-auto custom-scrollbar"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onScroll={handleScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          aria-label={`${label} code editor`}
          style={{ fontFamily: "'Fira Code', monospace" }}
        />
      </div>

      {/* Token Count Footer */}
      {tokenCounts && !error && (
        <div className="flex items-center justify-end px-4 py-2 bg-slate-900 border-t border-slate-700 space-x-4 shrink-0" aria-label="Token count estimates">
           <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider" aria-hidden="true">Est. Tokens:</div>
           <div className="text-xs font-mono text-slate-400 flex space-x-3">
              <span title="Gemini 2.5 Flash (Estimated)">
                <span className="text-indigo-400 mr-1" aria-hidden="true">◆</span>
                Gemini: <span className="text-white font-medium">~{tokenCounts.gemini.toLocaleString()}</span>
              </span>
              <span title="OpenAI GPT-4o (Estimated)">
                <span className="text-green-400 mr-1" aria-hidden="true">●</span>
                OpenAI: <span className="text-white font-medium">~{tokenCounts.openai.toLocaleString()}</span>
              </span>
              <span title="Lovable (Estimated)">
                <span className="text-pink-400 mr-1" aria-hidden="true">♥</span>
                Lovable: <span className="text-white font-medium">~{tokenCounts.lovable.toLocaleString()}</span>
              </span>
           </div>
        </div>
      )}

      {/* Regex Info Modal Overlay */}
      {showRegexInfo && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col p-6 animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4 shrink-0">
            <div className="flex items-center space-x-2">
               <span className="text-pink-400 text-xl" aria-hidden="true">🔍</span>
               <h3 id="modal-title" className="text-lg font-bold text-white">TOON Code Regex Patterns</h3>
            </div>
            <button 
              onClick={() => setShowRegexInfo(false)}
              className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 text-sm font-mono pr-2">
            
            <div className="space-y-2">
              <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                 <span aria-hidden="true">🛡️</span> Validation: Array Headers
              </h4>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] md:text-xs text-indigo-200 break-all font-medium leading-relaxed">
                {'^(\\s*)([\\w-]+)\\s*\\[\\s*(\\d+)\\s*\\]\\s*\\{([^}]+)\\}\\s*:\\s*$'}
              </div>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Validates array definitions. Expects <code>indentation</code>, <code>keyName</code>, <code>[count]</code>, <code>&#123;fields&#125;</code>, and a colon.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-indigo-400 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                <span aria-hidden="true">🛡️</span> Validation: Key-Value
              </h4>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] md:text-xs text-indigo-200 break-all font-medium leading-relaxed">
                {'^(\\s*)([\\w-]+)\\s*:\\s*(.*)$'}
              </div>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Validates standard properties. Matches <code>key: value</code> pairs with optional indentation.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-pink-400 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                <span aria-hidden="true">🎨</span> Highlighting Tokenizer
              </h4>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] md:text-xs text-pink-200 break-all font-medium leading-relaxed">
                {'(^[\\s]*[\\w-]+\\[\\d+\\]\\{[^}]+\\}:)|(^[\\s-]*[\\w-]+:)|(".*?")|(\\b-?\\d+(?:\\.\\d+)?\\b)|(\\b(?:true|false|null)\\b)|(,)'}
              </div>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                A composite regex that tokenizes the output for coloring. It captures Headers, Keys, Strings, Numbers, Booleans, and Commas in distinct groups.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};