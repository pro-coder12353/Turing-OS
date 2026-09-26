"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ContestabilityEngine({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<'viewing' | 'contesting' | 'evaluating' | 'resolved'>('viewing');
  const [argument, setArgument] = useState('');
  
  const handleContestSubmit = async () => {
    if (!argument.trim()) return;
    setStatus('evaluating');
    
    try {
      // Shritan's AI Backend Route
      await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userArgument: argument, contextId: 'REQ-842' })
      });
      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('resolved'); // Fallback for demo
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col font-sans max-w-4xl mx-auto mt-6">
      
      {/* Header */}
      <div className="border-b border-zinc-200 px-6 py-4 flex items-center justify-between bg-zinc-50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Case REQ-842</h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">Automated Loan Denial</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 font-medium">Final Decision:</span>
          {status === 'resolved' ? (
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">Overturned / Approved</span>
          ) : (
            <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-md border border-red-200">Denied</span>
          )}
        </div>
      </div>

      {/* AI Reasoning Graph */}
      <div className="p-6 bg-white">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">AI Reasoning Graph</h3>
        
        <div className="space-y-4">
          {/* Node 1 */}
          <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-zinc-900">Identity & KYC</p>
              <p className="text-xs text-zinc-500 mt-1">Passed multi-factor background check.</p>
            </div>
          </div>

          {/* Node 2 - The contested node */}
          <div className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${status === 'resolved' ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'}`}>
            {status === 'resolved' ? (
               <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            ) : (
               <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-zinc-900">Geographic Risk Assessment</p>
                {status === 'viewing' && (
                  <button 
                    onClick={() => setStatus('contesting')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded"
                  >
                    Contest Node
                  </button>
                )}
              </div>
              
              {status === 'resolved' ? (
                <p className="text-xs text-emerald-700 mt-1 font-medium">Overturned: User provided valid context regarding temporary zip code mismatch.</p>
              ) : (
                <p className="text-xs text-red-600 mt-1">Failed: Application address matches high-risk commercial zone instead of residential.</p>
              )}
              
              {/* Contest Input Box */}
              {status === 'contesting' && (
                <div className="mt-4 pt-4 border-t border-red-100">
                  <label className="block text-xs font-medium text-zinc-700 mb-2">Provide Counter-Evidence to AI:</label>
                  <textarea 
                    value={argument}
                    onChange={(e) => setArgument(e.target.value)}
                    placeholder="e.g. The address is a newly zoned residential building as of last month..."
                    className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button onClick={() => setStatus('viewing')} className="text-xs font-medium text-zinc-600 px-3 py-1.5 hover:bg-zinc-100 rounded">Cancel</button>
                    <button onClick={handleContestSubmit} className="text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded shadow-sm">Submit to AI Court</button>
                  </div>
                </div>
              )}

              {/* Evaluating State */}
              {status === 'evaluating' && (
                <div className="mt-4 pt-4 border-t border-red-100 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="text-xs font-medium text-indigo-600">AI is evaluating your counter-argument...</span>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
