"use client";

import { useState, useEffect } from 'react';
import SybilGateway from '@/components/SybilGateway';
import ContestabilityEngine from '@/components/ContestabilityEngine';
import { ArrowRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // Fetch actual data from backend
  useEffect(() => {
    if (isVerified) {
      // Re-fetch on verified or when selectedCase is cleared (to refresh table)
      fetch('http://localhost:5000/api/cases')
        .then(res => res.json())
        .then(data => setCases(data))
        .catch(err => console.error("Database offline", err));
    }
  }, [isVerified, selectedCase]); // <--- Dependency on selectedCase so it refetches when closed!

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
        <ContestabilityEngine caseData={selectedCase} onClose={() => setSelectedCase(null)} />
      </div>
    );
  }

  const filteredCases = cases.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      c.id.toLowerCase().includes(query) || 
      c.applicant.toLowerCase().includes(query) || 
      c.type.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">Decisions Queue</h2>
            <p className="text-sm text-zinc-500 mt-1">Review and contest automated system judgments.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              placeholder="Search ID, name, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm border border-zinc-200 bg-white text-zinc-700 py-1.5 px-3 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-zinc-900 min-w-[200px] sm:min-w-[250px]"
            />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-zinc-200 bg-white text-zinc-700 py-1.5 px-3 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="All">All Statuses</option>
              <option value="Denied">Denied</option>
              <option value="Flagged">Flagged</option>
              <option value="Shadowbanned">Shadowbanned</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Case ID</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Applicant</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Request Details</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCases.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-zinc-400">No cases match this filter.</td></tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedCase(c)} className="hover:bg-zinc-50 transition-colors group cursor-pointer">
                    <td className="px-4 sm:px-6 py-4 font-mono text-xs text-zinc-500">{c.id}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-zinc-900">{c.applicant}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{c.date}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-zinc-900">{c.amount} - <span className="font-normal text-zinc-500">{c.type}</span></div>
                      <div className="text-xs text-zinc-500 mt-0.5 truncate max-w-xs" title={c.purpose}>{c.purpose}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${
                        c.status === 'Denied' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                        c.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' :
                        c.status === 'Confirmed' ? 'bg-zinc-100 text-zinc-700 ring-zinc-500/20' :
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
