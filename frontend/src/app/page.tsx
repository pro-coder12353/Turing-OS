"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-zinc-900 font-sans px-4">
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl shadow-sm p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-zinc-900 rounded-sm"></div>
            <h1 className="font-semibold text-lg tracking-tight">Project Turing</h1>
          </div>
          <p className="text-sm text-zinc-500">Sign in to the enterprise portal.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Work Email</label>
            <input 
              type="email" 
              required 
              placeholder="name@company.com" 
              className="w-full text-sm border border-zinc-300 rounded-md p-2.5 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full text-sm border border-zinc-300 rounded-md p-2.5 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all" 
            />
          </div>
          <button 
            disabled={isLoading} 
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium py-2.5 rounded-md transition-colors flex justify-center items-center h-10 mt-2"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Continue'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-400">Secure SSO enabled</p>
        </div>
      </div>
    </div>
  );
}
