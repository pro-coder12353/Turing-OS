"use client";

import { useState } from 'react';
import SybilGateway from '@/components/SybilGateway';
import ContestabilityEngine from '@/components/ContestabilityEngine';
import { ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const router = useRouter();

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
              <tr onClick={() => setSelectedCase('REQ-842')} className="hover:bg-zinc-50 transition-colors group cursor-pointer">
                <td className="px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500">REQ-842</td>
                <td className="px-4 sm:px-6 py-4 text-zinc-900">Loan Application</td>
                <td className="px-4 sm:px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10">
                    Denied
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <button className="text-zinc-900 font-medium group-hover:text-zinc-600 inline-flex items-center gap-1 transition-colors">
                    Review <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors group cursor-pointer">
                <td className="px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500">MOD-91B</td>
                <td className="px-4 sm:px-6 py-4 text-zinc-900">Content Flag</td>
                <td className="px-4 sm:px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10">
                    Shadowbanned
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <button className="text-zinc-900 font-medium group-hover:text-zinc-600 inline-flex items-center gap-1 transition-colors">
                    Review <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
