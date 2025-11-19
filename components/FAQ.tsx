import React from 'react';

export const FAQ: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 lg:p-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mb-6">
          Optimizing LLM Workflows with TOON
        </h2>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
          Welcome to the future of <span className="text-indigo-300 font-semibold">AI data exchange</span>. 
          Discover why TOON is the most efficient format for Large Language Models and how to reduce your API costs.
        </p>
      </div>

      <div className="space-y-10">
        
        {/* 1. Understanding TOON */}
        <div className="grid gap-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">1.</span> Understanding TOON
          </h3>
          
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
               <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                 What exactly is TOON?
               </h4>
               <p className="text-slate-300 leading-relaxed">
                 <strong>Token-Oriented Object Notation (TOON)</strong> is a highly <strong>compact, human-readable data format</strong> specifically designed to optimize data exchange with <strong>Large Language Models (LLMs)</strong>. It represents a lossless, token-efficient encoding of the standard JSON data model.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div>
                 <h4 className="text-lg font-bold text-white mb-2">The "Token Tax" Problem</h4>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   JSON is highly verbose, requiring repetitive symbols like <code>&#123;&#125;</code>, <code>[]</code>, <code>"</code>, and <code>,</code>. Since LLMs charge by the token, this verbosity creates a financial "Token Tax". TOON minimizes this overhead while maintaining structure.
                 </p>
               </div>
               <div>
                 <h4 className="text-lg font-bold text-white mb-2">Why it's efficient</h4>
                 <ul className="space-y-2 text-slate-400 text-sm">
                   <li className="flex gap-2">
                     <span className="text-green-400">✓</span>
                     <span><strong>Tabular Arrays:</strong> Collapses uniform lists into CSV-like tables with a single header.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="text-green-400">✓</span>
                     <span><strong>Minimal Syntax:</strong> Uses indentation instead of braces.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="text-green-400">✓</span>
                     <span><strong>Guardrails:</strong> Explicit hints like <code>[N]</code> help LLMs parse reliably.</span>
                   </li>
                 </ul>
               </div>
            </div>
          </div>
        </div>

        {/* 2. Performance Metrics */}
        <div className="grid gap-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">2.</span> Performance & Savings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 text-center hover:border-indigo-500/30 transition-colors">
              <div className="text-4xl font-bold text-green-400 mb-2">30–60%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Token Reduction</div>
              <p className="text-sm text-slate-400 mt-3">Lower API costs immediately vs JSON.</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 text-center hover:border-indigo-500/30 transition-colors">
              <div className="text-4xl font-bold text-indigo-400 mb-2">73.9%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Parsing Accuracy</div>
              <p className="text-sm text-slate-400 mt-3">vs JSON's 69.7%. Fewer hallucinations.</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 text-center hover:border-indigo-500/30 transition-colors">
              <div className="text-4xl font-bold text-pink-400 mb-2">26.9</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Efficiency Score</div>
              <p className="text-sm text-slate-400 mt-3">vs JSON's 15.3. The optimal balance.</p>
            </div>
          </div>
        </div>

        {/* 3. Comparison */}
        <div className="grid gap-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">3.</span> Format Comparison
          </h3>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-slate-700/50">
                 <div className="md:w-1/4">
                   <span className="font-mono font-bold text-blue-400 text-lg">vs YAML</span>
                 </div>
                 <div className="md:w-3/4">
                   <p className="text-slate-300">
                     While readable, <strong>YAML is token-expensive</strong> for arrays of objects because it repeats keys for every single item. TOON's tabular feature dramatically outperforms YAML for list-heavy data.
                   </p>
                 </div>
               </div>
               
               <div className="flex flex-col md:flex-row gap-6">
                 <div className="md:w-1/4">
                   <span className="font-mono font-bold text-green-400 text-lg">vs CSV</span>
                 </div>
                 <div className="md:w-3/4">
                   <p className="text-slate-300">
                     CSV is efficient but cannot represent <strong>nested structures</strong> and lacks explicit metadata. TOON adds minimal overhead (5-10%) to provide the structural context and nesting LLMs need.
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* 4. Usage Strategy */}
        <div className="grid gap-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">4.</span> Usage Guide
          </h3>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700">
               <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-transparent">
                 <h4 className="font-bold text-indigo-300 mb-4 flex items-center gap-2">
                   <span>🚀</span> Use TOON For
                 </h4>
                 <ul className="space-y-3 text-sm text-slate-300">
                   <li className="flex items-start gap-2">
                     <span className="text-indigo-500 mt-0.5">•</span>
                     <span><strong>LLM I/O:</strong> Sending context to LLMs (RAG).</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-indigo-500 mt-0.5">•</span>
                     <span><strong>High Tabular Data:</strong> Database results with uniform rows.</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-indigo-500 mt-0.5">•</span>
                     <span><strong>Cost-Sensitive Apps:</strong> High volume API calls.</span>
                   </li>
                 </ul>
               </div>

               <div className="p-6 bg-gradient-to-br from-slate-900/20 to-transparent">
                 <h4 className="font-bold text-slate-400 mb-4 flex items-center gap-2">
                   <span>💾</span> Stick with JSON For
                 </h4>
                 <ul className="space-y-3 text-sm text-slate-400">
                   <li className="flex items-start gap-2">
                     <span className="text-slate-600 mt-0.5">•</span>
                     <span><strong>Traditional APIs:</strong> REST APIs & web services.</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-slate-600 mt-0.5">•</span>
                     <span><strong>Deep Nesting:</strong> Complex configs without lists.</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-slate-600 mt-0.5">•</span>
                     <span><strong>Legacy Pipelines:</strong> Existing storage tooling.</span>
                   </li>
                 </ul>
               </div>
            </div>
            <div className="bg-indigo-500/10 p-4 text-center border-t border-slate-700/50">
               <p className="text-indigo-200 text-sm font-medium">
                 💡 <span className="font-bold">Pro Tip:</span> Use a hybrid strategy. Store in JSON, convert to TOON for LLM calls.
               </p>
            </div>
          </div>
        </div>

        {/* 5. Tool Functionality (Existing + New) */}
        <div className="grid gap-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">5.</span> About This Converter
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
               <div className="mb-4 p-2 bg-pink-500/10 w-fit rounded-lg">
                 <span className="text-xl">⚡</span>
               </div>
               <h4 className="font-bold text-white mb-2">Why use this tool?</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-4">
                 Designed for "vibe coders" and developers alike, this tool offers an integrated workflow to instantly visualize token savings.
               </p>
               <ul className="text-sm text-slate-400 space-y-2">
                  <li>• <strong>JSON ↔ TOON ↔ CSV</strong> pipeline.</li>
                  <li>• Real-time token estimation.</li>
                  <li>• Visual validation of structure.</li>
               </ul>
             </div>

             <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
               <div className="mb-4 p-2 bg-blue-500/10 w-fit rounded-lg">
                 <span className="text-xl">🔄</span>
               </div>
               <h4 className="font-bold text-white mb-2">How CSV Unwinding Works</h4>
               <p className="text-slate-400 text-sm leading-relaxed">
                 When converting nested JSON/TOON to CSV, we perform <strong>Recursive Unwinding</strong>. If an object contains a list, we expand it into multiple rows, duplicating the parent data for each item. This ensures complex hierarchical data can be flattened without loss.
               </p>
             </div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Note on Token Counts:</strong> The token counters in this app use a local heuristic (~4 characters per token) for instant feedback. While actual tokenizer counts vary by model (Gemini vs GPT vs Claude), these estimates are sufficient for calculating ROI.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};