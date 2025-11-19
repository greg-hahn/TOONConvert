import React from 'react';

export const FAQ: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 lg:p-8 animate-in fade-in duration-500 pb-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mb-4">
          Optimizing LLM Workflows
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Understanding <span className="text-indigo-300 font-semibold">TOON</span> (Token-Oriented Object Notation) and how to reduce your AI API costs.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Section 1: What is TOON */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="shrink-0 p-2 bg-indigo-500/10 rounded-lg">
              <span className="text-2xl">🎭</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">What is TOON?</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>Token-Oriented Object Notation (TOON)</strong> is a highly compact, human-readable data format designed specifically for Large Language Models (LLMs). 
                It acts as a lossless, token-efficient encoding of the standard JSON data model.
              </p>
              <p className="text-slate-300 leading-relaxed">
                It minimizes the <strong>"Token Tax"</strong>—the cost incurred by verbose JSON syntax (brackets, quotes, commas)—while maintaining the structural hints LLMs need to parse data accurately.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: The Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 text-center">
             <div className="text-3xl font-bold text-green-400 mb-1">30–60%</div>
             <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Token Reduction</div>
             <p className="text-sm text-slate-400 mt-2">vs Standard JSON</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 text-center">
             <div className="text-3xl font-bold text-indigo-400 mb-1">73.9%</div>
             <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Parsing Accuracy</div>
             <p className="text-sm text-slate-400 mt-2">vs JSON's 69.7%</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-5 text-center">
             <div className="text-3xl font-bold text-pink-400 mb-1">High</div>
             <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Efficiency Score</div>
             <p className="text-sm text-slate-400 mt-2">Best balance of cost & accuracy</p>
          </div>
        </div>

        {/* Section 3: Comparison */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="shrink-0 p-2 bg-green-500/10 rounded-lg">
              <span className="text-2xl">🆚</span>
            </div>
            <div className="w-full">
              <h3 className="text-xl font-bold text-white mb-4">Format Showdown</h3>
              <div className="space-y-4">
                
                <div className="flex flex-col md:flex-row gap-4 border-b border-slate-700/50 pb-4">
                  <div className="w-24 font-mono font-bold text-yellow-400">JSON</div>
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-semibold">The Universal Standard</p>
                    <p className="text-slate-400 text-sm">Great for APIs, but verbose. Heavy bracket usage inflates token costs significantly.</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 border-b border-slate-700/50 pb-4">
                  <div className="w-24 font-mono font-bold text-blue-400">YAML</div>
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-semibold">The Readable Alternative</p>
                    <p className="text-slate-400 text-sm">Readable, but token-expensive for arrays because it repeats keys for every item.</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 border-b border-slate-700/50 pb-4">
                  <div className="w-24 font-mono font-bold text-green-400">CSV</div>
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-semibold">The Compact Choice</p>
                    <p className="text-slate-400 text-sm">Extremely efficient, but cannot handle nested data and lacks explicit type safety.</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-24 font-mono font-bold text-pink-400">TOON</div>
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-semibold">The AI Optimized Format</p>
                    <p className="text-slate-400 text-sm">
                      Combines the hierarchy of JSON with the tabular efficiency of CSV. 
                      It uses headers (<code className="text-xs bg-slate-900 px-1 py-0.5 rounded">key[n]&#123;fields&#125;:</code>) to declare keys once, then lists data compactly.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Strategy */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
           <div className="flex items-start space-x-4">
            <div className="shrink-0 p-2 bg-purple-500/10 rounded-lg">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">The Hybrid Strategy</h3>
              <p className="text-slate-300 text-sm mb-4">
                TOON isn't meant to replace JSON in your database or REST APIs. It is a specialized translation layer for AI.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-bold text-yellow-400 text-sm uppercase tracking-wide mb-1">Use JSON For</h4>
                    <ul className="list-disc list-inside text-slate-400 text-xs space-y-1">
                       <li>Traditional REST APIs</li>
                       <li>Deeply nested configuration files</li>
                       <li>Legacy storage pipelines</li>
                    </ul>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-pink-500">
                    <h4 className="font-bold text-pink-400 text-sm uppercase tracking-wide mb-1">Use TOON For</h4>
                    <ul className="list-disc list-inside text-slate-400 text-xs space-y-1">
                       <li>Sending large context to LLMs (RAG)</li>
                       <li>High-volume AI data processing</li>
                       <li>Tabular data (like SQL results)</li>
                    </ul>
                 </div>
              </div>
            </div>
           </div>
        </div>

        {/* Section 5: Tool Mechanics (Unwinding) */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="shrink-0 p-2 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">How does the Converter's "Unwinding" work?</h3>
              <p className="text-slate-300 leading-relaxed mb-3">
                 If you convert nested JSON to CSV using this tool, we perform <strong>Recursive Unwinding</strong>.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Since CSV is flat, we cannot represent a list inside an object directly. Instead, we "unwind" the array: if an object has a list of 3 items, we create 3 CSV rows, duplicating the parent data for each row. This ensures no data is lost, even if it becomes denormalized.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Token Estimation */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="shrink-0 p-2 bg-orange-500/10 rounded-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">About the Token Estimates</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                To provide instant feedback and keep the app responsive, the token counts shown in the editor are <strong>estimates</strong> calculated locally (using a standard ~4 chars/token heuristic).
              </p>
              <p className="text-slate-400 text-sm mt-2">
                While exact counts vary by model tokenizer, these estimates are sufficient for calculating your potential ROI and ensuring you stay within context windows.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};