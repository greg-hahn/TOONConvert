import React, { useState } from 'react';
import { DataFormat, TokenCounts } from '../types';
import { convertData, convertDataStream, getTokenCounts } from '../services/geminiService';
import { CodeEditor } from './CodeEditor';

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7 7"/></svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 9h4"/><path d="M3 5h4"/></svg>
);

const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const FunLoader = () => (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 transition-all duration-300" role="status" aria-label="Loading conversion">
    <div className="relative mb-4" aria-hidden="true">
      <div className="text-6xl animate-bounce filter drop-shadow-lg">🤖</div>
      <div className="absolute -bottom-1 -right-2 text-2xl animate-spin">⚙️</div>
    </div>
    <div className="flex flex-col items-center space-y-1">
      <span className="text-indigo-300 font-mono font-bold text-lg animate-pulse">Crunching Data...</span>
      <span className="text-slate-500 text-xs font-mono">Beep boop computing</span>
    </div>
  </div>
);

interface MultiOutputResult {
  format: DataFormat;
  data: string;
  tokens: TokenCounts;
  status?: string;
  error?: string;
}

export const Converter: React.FC = () => {
  const [inputData, setInputData] = useState<string>('');
  
  // Single Mode State
  const [outputData, setOutputData] = useState<string>('');
  const [outputTokens, setOutputTokens] = useState<TokenCounts | undefined>();
  const [outputError, setOutputError] = useState<string | null>(null);
  
  // Multi Mode State
  const [multiOutputs, setMultiOutputs] = useState<MultiOutputResult[]>([]);
  const [mode, setMode] = useState<'SINGLE' | 'MULTI'>('SINGLE');
  const [activeTab, setActiveTab] = useState<DataFormat>(DataFormat.TOON);

  const [fromFormat, setFromFormat] = useState<DataFormat | 'AUTO'>('AUTO');
  const [toFormat, setToFormat] = useState<DataFormat>(DataFormat.TOON);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [inputTokens, setInputTokens] = useState<TokenCounts | undefined>();

  const validateInput = (data: string, format: DataFormat | 'AUTO'): string | null => {
    if (!data.trim()) return null;

    if (format === DataFormat.JSON) {
      try {
        JSON.parse(data);
      } catch (e: any) {
        const msg = e.message || "Syntax error";
        return `Invalid JSON: ${msg}`;
      }
    }

    if (format === DataFormat.TOON) {
      const lines = data.trim().split('\n');
      let arrayItemsRemaining = 0;
      let inArray = false;
      let arrayStartLine = 0;
      
      // TOON Code Structural Regex
      // Header: key[count]{fields}:
      const arrayHeaderRegex = /^(\s*)([\w-]+)\s*\[\s*(\d+)\s*\]\s*\{([^}]+)\}\s*:\s*$/;
      // Key-Value: key: value
      const keyValueRegex = /^(\s*)([\w-]+)\s*:\s*(.*)$/;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (inArray) {
           // Inside array, expecting data rows.
           // If we encounter what looks like a new array header, it's likely an error in the previous count.
           if (arrayHeaderRegex.test(trimmedLine)) {
              return `Line ${i + 1}: Unexpected array start. The array starting at line ${arrayStartLine} is incomplete.`;
           }
           
           arrayItemsRemaining--;
           if (arrayItemsRemaining === 0) inArray = false;
        } else {
           // Expecting Key-Value or Array Header
           const arrayMatch = trimmedLine.match(arrayHeaderRegex);
           if (arrayMatch) {
              const count = parseInt(arrayMatch[3], 10);
              if (count < 0) return `Line ${i + 1}: Array count cannot be negative.`;
              if (count > 0) {
                  inArray = true;
                  arrayItemsRemaining = count;
                  arrayStartLine = i + 1;
              }
              continue;
           }

           const kvMatch = trimmedLine.match(keyValueRegex);
           if (!kvMatch) {
              return `Line ${i + 1}: Invalid TOON syntax. Expected 'key: value' or 'key[n]{fields}:'.`;
           }
        }
      }

      if (inArray) {
        return `Unexpected end of input. Array from line ${arrayStartLine} is missing ${arrayItemsRemaining} items.`;
      }
    }
    
    return null;
  };

  const detectSourceFormat = (data: string): DataFormat => {
    try {
      const json = JSON.parse(data);
      if (typeof json === 'object' && json !== null) return DataFormat.JSON;
    } catch (e) {}

    // Simple check for TOON (looks for "key[n]{...}:")
    if (/^(\s*)[\w-]+\s*\[\s*\d+\s*\]\s*\{[^}]+\}\s*:\s*$/m.test(data)) {
      return DataFormat.TOON;
    }

    // Default to CSV if it has commas or just text
    return DataFormat.CSV;
  };

  const handleConvert = async () => {
    if (!inputData.trim()) return;

    // Validation
    const validationError = validateInput(inputData, fromFormat);
    if (validationError) {
      setInputError(validationError);
      setInputTokens(undefined);
      setOutputTokens(undefined);
      setOutputError(null);
      return;
    }
    setInputError(null);
    setOutputError(null);

    setIsLoading(true);
    setMode('SINGLE');
    setOutputData('');
    setInputTokens(undefined);
    setOutputTokens(undefined);

    try {
      // 1. Start input token counting
      const inputTokenPromise = getTokenCounts(inputData);

      // 2. Stream conversion
      let fullResult = '';
      await convertDataStream(inputData, fromFormat, toFormat, (chunk) => {
        fullResult += chunk;
        setOutputData(prev => prev + chunk);
      });

      // 3. Update tokens
      const inputCounts = await inputTokenPromise;
      setInputTokens(inputCounts);
      
      const outputCounts = await getTokenCounts(fullResult);
      setOutputTokens(outputCounts);

    } catch (error: any) {
      console.error("Conversion error:", error);
      setOutputError(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertAll = async () => {
    if (!inputData.trim()) return;

    const validationError = validateInput(inputData, fromFormat);
    if (validationError) {
      setInputError(validationError);
      return;
    }
    setInputError(null);
    setOutputError(null);
    
    setIsLoading(true);
    setMode('MULTI');
    setMultiOutputs([]);
    setInputTokens(undefined);

    // Automatically switch to the first likely interesting tab (usually TOON unless input is TOON)
    setActiveTab(DataFormat.TOON);

    try {
      // 1. Determine source format to avoid redundant API calls
      const sourceFormat = fromFormat === 'AUTO' ? detectSourceFormat(inputData) : fromFormat;

      // 2. Calculate input tokens once
      const inputTokenCounts = await getTokenCounts(inputData);
      setInputTokens(inputTokenCounts);

      // 3. Define targets
      const targets = [DataFormat.JSON, DataFormat.CSV, DataFormat.TOON];

      // 4. Run all conversions in parallel
      const results = await Promise.all(
        targets.map(async (targetFormat) => {
          let data = '';
          let tokens: TokenCounts;
          let status: string | undefined;
          let error: string | undefined;

          // Optimization: If source matches target, use input directly
          if (sourceFormat === targetFormat) {
             data = inputData;
             // Optional: Prettify JSON if it is JSON to look nice in the output
             if (targetFormat === DataFormat.JSON) {
                try {
                    data = JSON.stringify(JSON.parse(inputData), null, 2);
                    status = "(Prettified Input)";
                } catch (e) { 
                    status = "(Original Input)"; 
                }
             } else {
                status = "(Original Input)";
             }
             // Count tokens on the potentially formatted data
             tokens = await getTokenCounts(data);
          } else {
             // Perform conversion
             data = await convertData(inputData, fromFormat, targetFormat);
             
             if (data.startsWith('ERROR:')) {
                 error = data.replace(/^ERROR:\s*/i, '').trim();
                 data = ''; // Clear data on error
                 tokens = { gemini: 0, openai: 0, lovable: 0 };
                 status = 'Failed';
             } else {
                 tokens = await getTokenCounts(data);
             }
          }
          
          return { format: targetFormat, data, tokens, status, error };
        })
      );

      setMultiOutputs(results);

    } catch (error) {
      console.error("Multi-conversion failed", error);
      setInputError("Failed to convert all formats.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputData('');
    setOutputData('');
    setMultiOutputs([]);
    setMode('SINGLE');
    setActiveTab(DataFormat.TOON);
    setInputError(null);
    setOutputError(null);
    setInputTokens(undefined);
    setOutputTokens(undefined);
  };

  const handleInputChange = (value: string) => {
    setInputData(value);
    if (inputError) setInputError(null); // Clear error on edit
    if (outputError) setOutputError(null); // Clear output error when input changes
  };

  const handleFromFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromFormat(e.target.value as DataFormat | 'AUTO');
    // Clear existing errors when format changes to prevent stuck states
    setInputError(null);
    setOutputError(null);
  };

  const formatOptions = [
    { label: 'Auto Detect', value: 'AUTO' },
    { label: 'JSON', value: DataFormat.JSON },
    { label: 'CSV', value: DataFormat.CSV },
    { label: 'TOON Code', value: DataFormat.TOON },
  ];

  const outputFormatOptions = formatOptions.filter(opt => opt.value !== 'AUTO');

  // Helper to get the content for the active tab in Multi Mode
  const activeMultiOutput = multiOutputs.find(o => o.format === activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8">
      {/* Controls Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          
          {/* Input Select */}
          <div className="w-full md:w-56 space-y-2">
            <label htmlFor="from-format-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Convert From</label>
            <div className="relative">
              <select
                id="from-format-select"
                value={fromFormat}
                onChange={handleFromFormatChange}
                className="w-full appearance-none bg-slate-900 border border-slate-600 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                aria-label="Select source format"
              >
                {formatOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ArrowDownIcon />
              </div>
            </div>
          </div>

          {/* Direction Indicator */}
          <div className="hidden md:flex items-center justify-center pt-6 text-slate-500" aria-hidden="true">
             <ArrowRightIcon />
          </div>

          {/* Output Select (Only enabled for single conversion) */}
          <div className="w-full md:w-56 space-y-2 relative group">
            <label htmlFor="to-format-select" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Convert To</label>
            <div className="relative">
              <select
                id="to-format-select"
                value={toFormat}
                onChange={(e) => setToFormat(e.target.value as DataFormat)}
                disabled={isLoading || mode === 'MULTI'}
                className="w-full appearance-none bg-slate-900 border border-slate-600 text-white py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Select destination format"
              >
                {outputFormatOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ArrowDownIcon />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto pt-6 flex gap-3">
            {/* Single Convert */}
            <button
              onClick={handleConvert}
              disabled={isLoading || !inputData.trim()}
              className={`
                flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500
                ${isLoading || !inputData.trim() 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-indigo-500/25'
                }
              `}
              title="Convert to selected format"
              aria-label="Convert to selected format"
            >
              {isLoading && mode === 'SINGLE' ? <Spinner /> : <SparklesIcon />}
              <span className="whitespace-nowrap">Convert</span>
            </button>

            {/* Convert All */}
            <button
              onClick={handleConvertAll}
              disabled={isLoading || !inputData.trim()}
              className={`
                flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold text-slate-200 border border-slate-600 shadow-lg transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500
                ${isLoading || !inputData.trim() 
                  ? 'bg-slate-800 cursor-not-allowed text-slate-500' 
                  : 'bg-slate-800 hover:bg-slate-700 hover:text-white hover:border-slate-500'
                }
              `}
              title="Convert to ALL formats at once"
              aria-label="Convert to all formats"
            >
              {isLoading && mode === 'MULTI' ? <Spinner /> : <LayersIcon />}
              <span className="whitespace-nowrap">Convert All</span>
            </button>

            {/* Clear All */}
            <button
              onClick={handleClear}
              disabled={isLoading || (!inputData && !outputData && multiOutputs.length === 0)}
              className={`
                flex items-center justify-center px-4 py-3 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500
                ${isLoading || (!inputData && !outputData && multiOutputs.length === 0)
                  ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed' 
                  : 'bg-slate-800 text-red-400 border-slate-700 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300'
                }
              `}
              title="Clear All Data"
              aria-label="Clear all data"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Warning */}
      <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">⚠️</span>
        <div className="text-xs text-amber-200 leading-relaxed">
          <p className="font-bold mb-1">Privacy Notice</p>
          <p>Your data is processed by an external AI service (Google Gemini). Please do not paste sensitive information, passwords, or private PII. Data is transmitted securely but is subject to third-party processing.</p>
        </div>
      </div>

      {/* Editors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[650px]">
        {/* Left Column: Input */}
        <div className="h-full flex flex-col">
          <CodeEditor
            label="Input Data"
            language={fromFormat === 'AUTO' ? 'Detected' : fromFormat}
            value={inputData}
            onChange={handleInputChange}
            placeholder="Paste your JSON, CSV, or TOON Code here..."
            tokenCounts={inputTokens}
            error={inputError}
          />
        </div>

        {/* Right Column: Output(s) */}
        <div className="h-full relative flex flex-col min-h-0">
          {mode === 'SINGLE' ? (
            // Single Output View
            <div className="h-full relative">
              {isLoading && !outputData && <FunLoader />}
              <CodeEditor
                label="Output Result"
                language={toFormat}
                value={outputData}
                readOnly={true}
                placeholder="Your converted code will appear here like magic!"
                tokenCounts={outputTokens}
                error={outputError}
              />
              
              {!outputData && !outputError && !isLoading && toFormat === DataFormat.TOON && (
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-30" aria-hidden="true">
                   <p className="text-6xl mb-4">📦</p>
                   <p className="text-sm font-mono">Waiting for structured data...</p>
                 </div>
              )}
            </div>
          ) : (
            // Multi Output View (Tabbed)
            <div className="h-full flex flex-col relative">
               {/* Tab Navigation */}
               <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg mb-2 overflow-x-auto shrink-0 scrollbar-hide" role="tablist">
                  {[DataFormat.TOON, DataFormat.JSON, DataFormat.CSV].map((format) => (
                    <button
                      key={format}
                      onClick={() => setActiveTab(format)}
                      className={`
                        flex-1 px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500
                        ${activeTab === format 
                          ? 'bg-indigo-600 text-white shadow-lg' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }
                      `}
                      role="tab"
                      aria-selected={activeTab === format}
                      aria-controls={`tab-panel-${format}`}
                    >
                      {format}
                    </button>
                  ))}
               </div>

               {/* Tab Content */}
               <div className="relative flex-1 min-h-0" role="tabpanel" id={`tab-panel-${activeTab}`}>
                 {isLoading ? (
                    <FunLoader />
                 ) : (
                    activeMultiOutput ? (
                      <CodeEditor
                        label={`${activeTab} Output ${activeMultiOutput.status ? activeMultiOutput.status : ''}`}
                        language={activeTab}
                        value={activeMultiOutput.data}
                        readOnly={true}
                        tokenCounts={activeMultiOutput.tokens}
                        error={activeMultiOutput.error}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-600 border border-slate-800 rounded-xl bg-slate-900/50">
                        <p className="text-sm">Ready to convert everywhere!</p>
                      </div>
                    )
                 )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          <span className="font-bold text-pink-400">TOON Code</span> is a high-efficiency structured data format that combines YAML-like hierarchy with tabular arrays.
        </p>
      </div>
    </div>
  );
};