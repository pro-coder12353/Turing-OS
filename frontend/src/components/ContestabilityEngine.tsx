"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ArrowLeft, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useMutationAudio } from '@/hooks/useMutationAudio';

export default function ContestabilityEngine({ caseData, onClose }: { caseData: any, onClose: () => void }) {
  const [status, setStatus] = useState<'viewing' | 'contesting' | 'evaluating' | 'resolved' | 'confirmed' | 'escalated'>('viewing');
  const [argument, setArgument] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [evalResult, setEvalResult] = useState<{ decision: string, explanation: string } | null>(null);
  
  const { speak, observeElement } = useMutationAudio(accessibilityMode);

  useEffect(() => {
    if (accessibilityMode) observeElement('ai-status-node', 'System update.');
  }, [accessibilityMode, status, observeElement]);

  const handleConfirm = async () => {
    setStatus('confirmed');
    if (accessibilityMode) speak("AI decision manually confirmed by human reviewer.");
    await fetch('http://localhost:5000/api/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contextId: caseData.id })
    });
  };

  const handleEscalate = async () => {
    setStatus('escalated');
    if (accessibilityMode) speak("Application escalated to Department Head.");
    await fetch('http://localhost:5000/api/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contextId: caseData.id })
    });
  };

  const handleContestSubmit = async () => {
    if (!argument.trim()) return;
    setStatus('evaluating');
    if (accessibilityMode) speak('Submitting counter evidence to AI Court.');
    
    try {
      const res = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userArgument: argument, contextId: caseData.id })
      });
      
      const data = await res.json();
      setEvalResult({ decision: data.aiDecision, explanation: data.explanation });
      setStatus('resolved');
      
    } catch {
      setEvalResult({ decision: 'Maintained', explanation: 'Error connecting to AI verification server.' });
      setStatus('resolved');
    }
  };

  const toggleA11y = () => {
    const newState = !accessibilityMode;
    setAccessibilityMode(newState);
    if (newState && window.speechSynthesis) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Accessibility DOM engine activated."));
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col font-sans max-w-4xl mx-auto">
      <div className="border-b border-zinc-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Case {caseData.id} - {caseData.applicant}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{caseData.type} | {caseData.amount}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <button 
            onClick={toggleA11y}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border flex-1 sm:flex-none ${
              accessibilityMode ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {accessibilityMode ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            A11y Engine
          </button>
          <div className="hidden sm:block h-6 w-px bg-zinc-200"></div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-zinc-500 font-medium">Final Decision:</span>
            {evalResult?.decision === 'Reversed' ? (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">Approved</span>
            ) : status === 'confirmed' ? (
              <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-md border border-zinc-200">Confirmed</span>
            ) : status === 'escalated' ? (
              <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-md border border-orange-200">Pending Escalation</span>
            ) : (
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                caseData.status === 'Flagged' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {caseData.status}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-white">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4 uppercase tracking-wider">Reasoning Graph</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-zinc-900">Identity & KYC</p>
              <p className="text-xs text-zinc-500 mt-1">Passed multi-factor background check.</p>
            </div>
          </div>

          <div className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
            status === 'resolved' 
              ? (evalResult?.decision === 'Reversed' ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30') 
              : status === 'confirmed' ? 'border-zinc-200 bg-zinc-50'
              : status === 'escalated' ? 'border-orange-200 bg-orange-50/30'
              : (caseData.status === 'Flagged' ? 'border-amber-200 bg-amber-50/30' : 'border-red-200 bg-red-50/30')
          }`}>
            {status === 'resolved' && evalResult?.decision === 'Reversed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            ) : (caseData.status === 'Flagged' && status !== 'resolved' && status !== 'confirmed' && status !== 'escalated') ? (
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            ) : status === 'confirmed' ? (
              <CheckCircle2 className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
            ) : status === 'escalated' ? (
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <p className="text-sm font-medium text-zinc-900">Algorithmic Risk Assessment</p>
                {(status === 'viewing' || status === 'resolved') && (
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 flex-wrap sm:flex-nowrap">
                    {status === 'viewing' && (
                      <>
                        <button 
                          onClick={() => {
                            setStatus('confirmed');
                            if (accessibilityMode) speak("AI decision manually confirmed by human reviewer.");
                          }}
                          className="flex-1 sm:flex-none text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white px-3 py-1.5 rounded border border-zinc-200 shadow-sm"
                        >
                          Confirm AI
                        </button>
                        <button 
                          onClick={handleEscalate}
                          className="flex-1 sm:flex-none text-xs font-semibold text-orange-700 hover:text-orange-800 bg-orange-50 px-3 py-1.5 rounded border border-orange-200 shadow-sm"
                        >
                          Escalate to Head
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        setStatus('contesting');
                        setArgument('');
                        setEvalResult(null);
                        if (accessibilityMode) speak("Contest mode activated. Enter counter evidence.");
                      }}
                      className="w-full sm:w-auto text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded border border-indigo-100"
                    >
                      Contest Node
                    </button>
                  </div>
                )}
              </div>
              
              <div id="ai-status-node" className="mt-2">
                {status === 'resolved' && evalResult ? (
                  <p className={`text-xs font-medium break-words ${evalResult.decision === 'Reversed' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {evalResult.explanation}
                  </p>
                ) : status === 'confirmed' ? (
                  <p className="text-xs font-medium text-zinc-600 bg-zinc-100/50 p-2 rounded border border-zinc-200 inline-block mt-1">
                    ✓ Decision formally endorsed and locked by human reviewer.
                  </p>
                ) : status === 'escalated' ? (
                  <p className="text-xs font-medium text-orange-700 bg-orange-50 p-2 rounded border border-orange-200 inline-block mt-1">
                    ⏳ Employee lacked permission. Application escalated to Department Head for review.
                  </p>
                ) : status === 'viewing' ? (
                  <p className={`text-xs break-words ${caseData.status === 'Flagged' ? 'text-amber-700' : 'text-red-600'}`}>
                    {caseData.status === 'Flagged' ? 'Warning' : 'Failed'}: {caseData.reason}
                  </p>
                ) : null}
              </div>
              
              {status === 'contesting' && (
                <div className="mt-4 pt-4 border-t border-red-100">
                  <label className="block text-xs font-medium text-zinc-700 mb-2">Provide Counter-Evidence:</label>
                  <textarea 
                    value={argument}
                    onChange={(e) => setArgument(e.target.value)}
                    placeholder="Enter verifiable evidence..."
                    className="w-full text-sm border border-zinc-300 rounded-md p-2 focus:ring-1 focus:ring-indigo-500 outline-none resize-y min-h-[80px]"
                  />
                  <div className="mt-3 flex flex-col sm:flex-row justify-end gap-2">
                    <button onClick={() => {
                      setStatus('viewing');
                      if (accessibilityMode) speak("Contest cancelled.");
                    }} className="text-xs font-medium text-zinc-600 px-3 py-2 sm:py-1.5 hover:bg-zinc-100 rounded w-full sm:w-auto">Cancel</button>
                    <button onClick={handleContestSubmit} className="text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-2 sm:py-1.5 rounded shadow-sm w-full sm:w-auto">Submit</button>
                  </div>
                </div>
              )}

              {status === 'evaluating' && (
                <div className="mt-4 pt-4 border-t border-red-100 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin flex-shrink-0" />
                  <span className="text-xs font-medium text-indigo-600 break-words">Evaluating counter-argument...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
