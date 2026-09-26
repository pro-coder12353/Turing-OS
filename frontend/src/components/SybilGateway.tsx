"use client";

import React, { useState } from 'react';

export default function SybilGateway({ onVerified }: { onVerified: () => void }) {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');

  const startVerification = async () => {
    setStatus('verifying');
    
    // Simulating the delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const response = await fetch('http://localhost:5000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof: 'crypto-pow-token', cycles: 150 })
      });

      const data = await response.json();

      if (data.verified) {
        setStatus('success');
        setTimeout(() => onVerified(), 600);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
    }
  };

  return (
    <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">Security Check</h2>
        <p className="text-sm text-zinc-500 mt-1">Please verify your session to continue.</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-md">
        <div className="flex items-center gap-3">
          {status === 'idle' && (
            <div className="w-5 h-5 rounded border-2 border-zinc-300"></div>
          )}
          {status === 'verifying' && (
            <div className="w-5 h-5 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin"></div>
          )}
          {status === 'success' && (
            <div className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'failed' && (
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
          )}
          <span className="text-sm font-medium text-zinc-700">
            {status === 'idle' ? 'Verify you are human' : 
             status === 'verifying' ? 'Verifying...' : 
             status === 'success' ? 'Verified' : 'Verification failed'}
          </span>
        </div>
        
        {status === 'idle' && (
          <button 
            onClick={startVerification}
            className="text-xs font-medium text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 px-3 py-1.5 rounded transition-colors shadow-sm"
          >
            Start
          </button>
        )}
      </div>
      
      <div className="mt-4 text-[10px] text-zinc-400 text-right uppercase tracking-wider font-semibold">
        Protected by Project Turing
      </div>
    </div>
  );
}
