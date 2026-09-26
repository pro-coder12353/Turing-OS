"use client";

import { useState, useEffect } from 'react';
import SybilGateway from '@/components/SybilGateway';
import ContestabilityEngine from '@/components/ContestabilityEngine';
import { ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const router = useRouter();

  // Fetch actual data from backend
  useEffect(() => {
    if (isVerified) {
      fetch('http://localhost:5000/api/cases')
        .then(res => res.json())
        .then(data => setCases(data))
        .catch(err => console.error("Database offline", err));
    }
  }, [isVerified]);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex items-center justify-center p-4 font-sans">
         <SybilGateway onVerified={() => setIsVerified(true)} />
      </div>
    );
  }

  if (selectedCase) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans py-6 px-4 sm:py-12">
        <ContestabilityEngine onClose={() => setSelectedCase(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-zinc-900 rounded-sm"></div>
            <h1 className="font-semibold text-sm tracking-tight">Project Turing</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
              <span className="text-xs text-zinc-500 font-medium">Production</span>
            </div>
            <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">Decisions Queue</h2>
          <p className="text-sm text-zinc-500 mt-1">Review and contest automated system judgments.</p>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Case ID</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Type</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cases.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-zinc-400">Loading Postgres Database...</td></tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedCase(c.id)} className="hover:bg-zinc-50 transition-colors group cursor-pointer">
                    <td className="px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500">{c.id}</td>
                    <td className="px-4 sm:px-6 py-4 text-zinc-900">{c.type}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${
                        c.status === 'Denied' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                        c.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' :
                        'bg-amber-50 text-amber-700 ring-amber-600/10'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <button className="text-zinc-900 font-medium group-hover:text-zinc-600 inline-flex items-center gap-1 transition-colors">
                        Review <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
